import { compare, genSalt, hash } from 'bcrypt'

const hashPassword = async ({ password, saltRounds = 10 }: { password: string; saltRounds?: number }) => {
		const generatedSalt: string = await genSalt(saltRounds)
		const passwordHash: string = await hash(password, generatedSalt)
		return passwordHash
}

const comparePasswords = async ({ password, hash }: { password: string; hash: string }) => {
	const isMatch: boolean = await compare(password, hash)
	return isMatch
}

export { hashPassword, comparePasswords }
