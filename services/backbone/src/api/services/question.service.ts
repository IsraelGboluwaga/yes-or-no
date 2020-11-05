import { isEmpty } from 'lodash/fp'

import { omitUndefined } from '../lib/helpers'
import { Game } from '../models'
import { IGame } from '../models/Game'
import { IQuestionOnly, Question } from '../models/Question'

interface ICreateQuestion extends IQuestionOnly {
  userId: string
}

const createQuestion = async (args: ICreateQuestion) => {
  const { game_id: gameId, text, answer, userId } = args
  const allowedAnswers = ['yes', 'no']
  if (!gameId) {
    throw { message: 'The game ID is required', code: 422 }
  }
  if (!(text && answer)) {
    throw { message: 'Kindly put in the question and the answer', code: 422 }
  }
  if (!allowedAnswers.includes(answer.toLowerCase())) {
    throw { message: 'Answer has to be yes or no', code: 422 }
  }

  const game: IGame | null = await Game.findById(gameId).populate('to_ask')
  if (!game) {
    throw { message: 'This game does not exist', code: 422 }
  }
  if (game.to_ask !== userId) {
    throw { message: 'You are not eligible to ask the question', code: 422 }
  }
  if (game.winner) {
    throw { message: `Game is already won by ${game.winner}`, code: 409 }
  }
  if (game.questions.length >= 20) {
    await game?.updateOne({ winner: game.to_ask })
    throw { message: `Game is already won by ${(game.to_ask as any).username}`, code: 409 }
  }
  const question: any = await new Question({ ...args, answer: answer.toLowerCase() }).save()
  await Game.findOneAndUpdate(
    { _id: gameId },
    // @ts-ignore
    { $push: { questions: [question._id!] } }
  )
  return { ...question._doc }
}

const fetchQuestion = (id: string) => Question.findById(id)

const update = async ({ _id, ...rest }: any) => {
  const attr = omitUndefined(rest)
  if (isEmpty(attr)) {
    throw { message: 'no fields specified and no data to update', code: 422 }
  }
  const question = await Question.findById(_id).populate('game_id')
  if (attr.is_answer_correct === true) {
    attr.winner = (question?.game_id as any).to_answer
  }
  return question?.updateOne({ $set: { ...attr } }, { new: true })
}

export { createQuestion, fetchQuestion, update }
