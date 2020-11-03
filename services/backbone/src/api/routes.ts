import '../../setup/envConfig'

import * as express from 'express'

import { AuthController, GameController, QuestionController, UserController } from './controllers'
const { authenticateUser } = AuthController
const { register, login } = UserController
const { createGameInstance, fetchGame, updateGameProperty } = GameController
const { askQuestion, getQuestion, updateQuestion } = QuestionController

const routes = (app: express.Router) => {
  app.get('/', (req: express.Request, res: express.Response) =>
    res.status(200).json({ message: 'ok' })
  )

  // USER
  app.post('/user', register)
  app.post('/user/login', login)

  // GAME
  app.get('/game/:_id', authenticateUser, fetchGame)
  app.post('/game', authenticateUser, createGameInstance)
  app.patch('/game', authenticateUser, updateGameProperty)

  // QUESTION
  app.post('/question', authenticateUser, askQuestion)
  app.get('/question/:_id', authenticateUser, getQuestion)
  app.patch('/question', authenticateUser, updateQuestion)

  return app
}

export { routes }
