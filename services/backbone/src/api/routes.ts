import '../../setup/envConfig'

import * as express from 'express'

import { AuthController, UserController, GameController } from './controllers'
const { authenticateUser } = AuthController
const { register, login } = UserController
const { createGameInstance, fetchGame, updateGameProperty } = GameController

const routes = (app: express.Router) => {
  app.get('/', (req: express.Request, res: express.Response) =>
    res.status(200).json({ message: "Watchu lookin' for here?" })
  )
  app.post('/user', register)
  app.post('/user/login', login)

  app.get('/game/:_id', authenticateUser, fetchGame)
  app.post('/game', authenticateUser, createGameInstance)
  app.patch('/game', authenticateUser, updateGameProperty)
  return app
}

export { routes }
