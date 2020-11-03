import { Request, Response, NextFunction } from 'express'
import { failure } from '../lib/response'
import { logger } from '../../config/winston'
import { User } from '../models'
import { verifyToken } from '../services/auth.service'

const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers || !req.headers['x-auth-token']) {
      failure({ res, message: 'You do not have access to this resource', httpCode: 401 })
    }
    const token = req.headers['x-auth-token'] as string
    const username: string = verifyToken(token).username
    const user = await User.findOne({ username })
    if (user?.username !== username) {
      return failure({ res, message: 'You do not have access to this resource', httpCode: 403 })
    }
    ;(req as any).user = user
    next()
  } catch (err) {
    logger.error(err)
    return failure({
      res,
      message: err.message || 'Internal Server Error',
      httpCode: err.code || 500,
    })
  }
}

export { authenticateUser }
