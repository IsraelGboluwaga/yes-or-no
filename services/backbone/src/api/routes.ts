import '../../setup/envConfig'

import * as express from 'express'
import { AuthController, UserController } from './controllers'
const { authenticateUser } = AuthController
const { register, login } = UserController

const routes = (app: express.Router) => {
  app.get('/', (req: express.Request, res: express.Response) =>
    res.status(200).json({ message: "Watchu lookin' for here?" })
  )
  app.post('/user', register)
  app.post('/user/login', login)
  return app
}

export { routes }
