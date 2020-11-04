import { isEmpty } from 'lodash/fp'

import { omitUndefined } from '../lib/helpers'
import { Game } from '../models'
import { IQuestionOnly, Question } from '../models/Question'

const createQuestion = async (args: IQuestionOnly) => {
  const { game_id: gameId, text, answer } = args
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

  const question: any = await new Question(args).save()
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
  return Question.findOneAndUpdate({ _id }, { $set: { ...attr } }, { new: true })
}

export { createQuestion, fetchQuestion, update }
