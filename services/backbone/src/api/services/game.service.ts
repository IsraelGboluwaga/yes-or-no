import { isEmpty } from 'lodash/fp'

import { omitUndefined } from '../lib/helpers'
import { Game } from '../models'
import { IGame } from '../models/Game'

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
  const playerOne: string = req.user._id
  if (!(to_ask || to_answer)) {
    throw { message: 'You really have to decide if you will be asking or answering', code: 422 }
  }
  const activePlayerOneGame = await Game.findOne({
    player_one: playerOne,
    player_two: playerOne,
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
  const newGame: any = { player_one: playerOne }
  if (to_ask && !to_answer) newGame.to_ask = 1
  if (!to_ask && to_answer) newGame.to_answer = 1

  const gameInstance = new Game(newGame) as IGame
  const game: any = await gameInstance.save()
  return { ...game._doc }
}

const getGame = (_id: string) =>
  Game.findById(_id).populate('player_one').populate('player_two').populate('questions')

const update = async ({ _id, ...rest }: any) => {
  const attr = omitUndefined(rest)
  if (isEmpty(attr)) {
    throw { message: 'no fields specified and no data to update', code: 422 }
  }
  const game = await Game.findById(_id)
  if (!game) {
    throw { message: 'game not found', httpCode: 404 }
  }
  if (attr.player_two) {
    if (attr.player_two == game.player_two && game.is_active) {
      return game
    }
    if (game.player_two || game.is_active) {
      throw { message: 'Oops. Someone else already joined the game', code: 409 }
    }
    attr.is_active = true
    if (game?.to_ask) {
      attr.to_answer = 2
    } else {
      attr.to_ask = 2
    }
  }
  return Game.findOneAndUpdate({ _id }, { ...attr }, { new: true })
}

export { createGame, getGame, update }
