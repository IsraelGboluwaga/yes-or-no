import '../../setup/envConfig'

import * as express from 'express'

const routes = (app: express.Router) => {
  app.get('/', (req, res: express.Response) => res.status(200).json({ message: 'O porr' }))
  return app
}

export { routes }
