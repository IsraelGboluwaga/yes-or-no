import { Document, Model, model, Schema } from 'mongoose'

interface IGameOnly {
  player_one: string
  player_two: string
  questions: string[]
  to_ask: number
  to_answer: number
  is_active: boolean
  winner: string
}

interface IGameAttributes extends IGameOnly {
  _id: string
}

interface IGame extends Document, IGameOnly {}
interface IGameModel extends Model<IGame> {}

const GameSchema = new Schema(
  {
    player_one: { type: Schema.Types.ObjectId, ref: 'User' },
    player_two: { type: Schema.Types.ObjectId, ref: 'User' },
    questions: { type: [Schema.Types.ObjectId], ref: 'Question' },
    to_ask: { type: Number, min: 1, max: 2, default: null },
    to_answer: { type: Number, min: 1, max: 2, default: null },
    is_active: { type: Boolean, default: false },
    winner: { type: Number, min: 1, max: 2, default: null },
  },
  { timestamps: true }
)

const Game = model<IGame, IGameModel>('Game', GameSchema)

export { Game, IGame, IGameOnly, IGameAttributes }
