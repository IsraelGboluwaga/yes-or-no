import { isEmpty } from 'lodash/fp'

import { omitUndefined } from '../lib/helpers'
import { Game } from '../models'

export interface ICreateGameParams {
  req: any
  to_ask?: boolean
  to_answer?: boolean
}

const getOpponentNameFromPopulatedGameObject = ({
  playerName,
  gameObject,
}: {
  playerName: string
  gameObject: any
}) => {
  const { player_one, player_two } = gameObject
  return playerName === player_one.username ? player_two.username : player_one.username
}

const createGame = async ({ req, to_ask, to_answer }: ICreateGameParams) => {
  const username = req.user.username
  const player_one = req.user._id
  if (!(to_ask || to_answer)) {
    throw { message: 'You really have to decide if you will be asking or answering', code: 422 }
  }
  const activePlayerOneGame = await Game.findOne({
    player_one,
    player_two: player_one,
    isActive: true,
  })
    .populate('player_one')
    .populate('player_two')

  if (activePlayerOneGame) {
    const opponent = getOpponentNameFromPopulatedGameObject({
      playerName: username,
      gameObject: activePlayerOneGame,
    })
    throw {
      message: `Kindly finish up the active game with ${opponent}`,
    }
  }
  const gameInstance = new Game({
    player_one,
    to_ask: to_ask && player_one,
    to_answer: to_answer && player_one,
  })
  const game: any = await gameInstance.save()
  return { ...game._doc }
}

const getGame = (_id: string) => Game.findById(_id)

const update = async ({ _id, ...rest }: any) => {
  const attr = omitUndefined(rest)
  if (isEmpty(attr)) {
    throw { message: 'no fields specified and no data to update', code: 422 }
  }
  const game = await getGame(_id)
  if (!_id || !game) {
    throw { message: 'game not found', httpCode: 404 }
  }
  if (attr.player_two) {
    attr.isActive = true
    if (game?.to_ask) {
      attr.to_answer = attr.player_two
    } else {
      attr.to_ask = attr.player_two
    }
  }
  return Game.findOneAndUpdate({ _id }, { ...attr }, { new: true })
}

export { createGame, getGame, update }
