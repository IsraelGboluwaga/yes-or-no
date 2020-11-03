import { Request, Response } from 'express'
import { logger } from '../../config/winston'
import { failure, success } from '../lib/response'
import { ICreateGameParams } from '../services/game.service'
import { GameService } from '../services'

const { createGame, getGame, update } = GameService

const createGameInstance = async (req: Request, res: Response) => {
  const { to_ask, to_answer }: ICreateGameParams = req.body
  try {
    const data = await createGame({ req, to_ask, to_answer })
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

const updateGameProperty = async (req: Request, res: Response) => {
  const { _id, ...rest } = req.body
  try {
    const data = await update({ _id, ...rest })
    return success({ res, data, message: 'updated', httpCode: 200 })
  } catch (err) {
    logger.error(err)
    return failure({
      res,
      message: err.message || 'Internal Server Error',
      httpCode: err.code || 500,
    })
  }
}

const fetchGame = async (req: Request, res: Response) => {
  const { _id } = req.params
  try {
    const data = await getGame(_id)
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

export { createGameInstance, updateGameProperty, fetchGame }
