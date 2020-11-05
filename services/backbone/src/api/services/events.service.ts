import { Socket } from 'socket.io'

import { logger } from '../../config/winston'
import { IQuestionOnly, Question } from '../models/Question'

const socketEvents = (socket: Socket) => {
  logger.info('Socket Initialized')

  socket.on('question-asked', async (data: IQuestionOnly) => {
    const questionCreated: any = await Question.findOne(data)
    socket.emit('question-saved', { ...questionCreated._doc })
  })

  socket.on('question-answered', async (data) => {
    const questionUpdated: any = await Question.findOne(data)
    socket.emit('answer-saved', { ...questionUpdated._doc })
  })
}

export { socketEvents }
