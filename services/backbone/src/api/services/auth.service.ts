import moment from 'moment-timezone'
import { compare, genSalt, hash } from 'bcrypt'
import { sign, verify } from 'jsonwebtoken'

import { config } from '../../config/settings'
import { IUser } from '../models/User'
import { time } from 'console'

const hashPassword = async ({
  password,
  saltRounds = 10,
}: {
  password: string
  saltRounds?: number
}) => {
  const generatedSalt: string = await genSalt(saltRounds)
  const passwordHash: string = await hash(password, generatedSalt)
  return passwordHash
}

const comparePasswords = async ({ password, hash }: { password: string; hash: string }) => {
  const isMatch: boolean = await compare(password, hash)
  return isMatch
}

const generateToken = (userObject: any) => {
  return sign(userObject, config.jwtSecret)
}

const verifyToken = (token: string): IUser => {
  return verify(token, config.jwtSecret) as IUser
}

const isTokenExpired = (timestamp: number) => {
  const tokenIssue = moment.utc(timestamp)
  const now = moment.utc()
  return Math.abs(tokenIssue.diff(now, 's')) > config.maxTimeBeforeExpiry
}

export { hashPassword, comparePasswords, generateToken, verifyToken }
