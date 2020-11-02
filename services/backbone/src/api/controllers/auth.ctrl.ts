import { sign, verify } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { failure } from '../lib/response'
import { logger } from '../../config/winston'
import { config } from '../../config/settings'

const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers || !req.headers['x-auth-token']) {
      failure({ res, message: 'You do not have access to this resource', httpCode: 401 })
    }
    const token = req.headers['x-auth-token'] as string
    // Verify token, get object
    // check for username
    // if it does not exist, return 403
    // if it does, assign user (from db) to req.user
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

// todo: type the param to take user model type
const generateToken = (userObject: any) => {
  return sign(userObject, config.jwtSecret)
}

// todo: type this to return user model type
const verifyToken = (token: string) => {
  return verify(token, config.jwtSecret)
}

export { authenticateUser }
