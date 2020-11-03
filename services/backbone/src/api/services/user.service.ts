import { Request } from 'express'
import { isAlphanumeric } from 'validator'
import { logger } from '../../config/winston'
import { IUser, IUserOnly, User } from '../models/User'
import { comparePasswords, generateToken, hashPassword } from './auth.service'

const addUser = async ({ username, password }: IUserOnly) => {
  if (password.length < 6) {
    throw { message: 'Password must be at least 6 characters long', code: 422 }
  }
  logger.info(username)
  if (!isAlphanumeric(username)) {
    throw { message: 'Username can contain only letters and numbers', code: 422 }
  }
  const usernameInDb = await fetchUser(username)
  if (usernameInDb) {
    throw { message: 'User already exists', code: 409 }
  }
  const newUser: IUser = new User({ username, password: await hashPassword({ password }) })
  const user = (await newUser.save()) as any
  delete (user as any).password
  const token = generateToken({ _id: user._id, username: user.username, timestamp: Date.now() })
  return { ...user._doc, token }
}

const loginUser = async ({
  req,
  username,
  password,
}: {
  req: Request
  username: string
  password: string
}) => {
  const user: any = await fetchUser(username)
  if (!user) {
    throw { message: 'You do not have an account, kindly create an account', httpCode: 404 }
  }
  const passwordsMatch: boolean = await comparePasswords({ password, hash: user.password })
  if (!passwordsMatch) {
    throw { message: 'Invalid Password', httpCode: 401 }
  }
  ;(req as any).user = user
  const token = generateToken({ _id: user._id, username: user.username, timestamp: Date.now() })
  return { ...user._doc, token }
}

const fetchUser = async (username: string) => {
  return User.findOne({ username })
}

export { addUser, fetchUser, loginUser }
