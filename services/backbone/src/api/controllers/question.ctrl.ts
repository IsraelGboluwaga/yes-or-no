import { Request, Response } from 'express'

import { logger } from '../../config/winston'
import { failure, success } from '../lib/response'
import { IQuestionOnly } from '../models/Question'
import { QuestionService } from '../services'

const { createQuestion, fetchQuestion, update } = QuestionService

const askQuestion = async (req: Request, res: Response) => {
  const { game_id, text, answer }: IQuestionOnly = req.body
  try {
    const data = await createQuestion({ game_id, text, answer, userId: req.user._id })
    return success({ res, data, httpCode: 201 })
  } catch (err) {
    logger.error(err)
    return failure({
      res,
      message: err.message || 'Internal Server Error',
      httpCode: err.code || 500,
    })
  }
}

const getQuestion = async (req: Request, res: Response) => {
  const { _id } = req.params
  try {
    const data = await fetchQuestion(_id)
    return success({ res, data, httpCode: 200 })
  } catch (err) {
    logger.error(err)
    return failure({
      res,
      message: err.message || 'Internal Server Error',
      httpCode: err.code || 500,
    })
  }
}

const updateQuestion = async (req: Request, res: Response) => {
  const { _id, ...rest } = req.body
  try {
    const data = await update({ _id, ...rest })
    return success({ res, data, httpCode: 200 })
  } catch (err) {
    logger.error(err)
    return failure({
      res,
      message: err.message || 'Internal Server Error',
      httpCode: err.code || 500,
    })
  }
}

export { askQuestion, getQuestion, updateQuestion }
