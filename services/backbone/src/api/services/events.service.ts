import io, { Socket } from 'socket.io'

import { logger } from '../../config/winston'
import { IQuestionOnly } from '../models/Question'

const socketEvents = (socket: Socket, io: io.Server) => {
  logger.info('Socket Initialized')

  socket.on('game-joined', () => {
    io.emit('game-start')
  })

  socket.on('question-asked', async (data: IQuestionOnly) => {
    io.emit('question-saved')
  })

  socket.on('question-answered', async (data) => {
    io.emit('answer-saved')
  })
}

export { socketEvents }
