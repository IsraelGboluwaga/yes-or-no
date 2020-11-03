import { compare, genSalt, hash } from 'bcrypt'
import { sign, verify } from 'jsonwebtoken'
import { config } from '../../config/settings'
import { IUser } from '../models/User'

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

export { hashPassword, comparePasswords, generateToken, verifyToken }
