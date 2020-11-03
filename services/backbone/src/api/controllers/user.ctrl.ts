import { Request, Response } from 'express'
import { IUser, IUserOnly } from '../models/User'
import { success, failure } from '../lib/response'
import { UserService } from '../services'

const { addUser, loginUser } = UserService
const register = async (req: Request, res: Response) => {
  const { username, password }: IUserOnly = req.body
  try {
    const user = await addUser({ username, password })
    return success({ res, data: user, httpCode: 201 })
  } catch (err) {
    return failure({ res, message: err.message || 'Internal Server Error', httpCode: err.code || 500})
  }
}

const login =  async (req: Request, res: Response) => {
  const { username, password }: IUserOnly = req.body
  try {
    const data = await loginUser({ req, username, password })
    return success({ res, data, httpCode: 200 })
  } catch (err) {
    return failure({ res, message: err.message || 'Internal Server Error', httpCode: err.code || 500 })
  }
}

export { register, login }
