import { Document, Model, model, Schema } from 'mongoose'

interface IGameOnly {
  player_one: string
  player_two: string
  questions: string[]
  to_ask: string
  to_answer: string
  isActive: boolean
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
    to_ask: { type: Schema.Types.ObjectId, ref: 'User' },
    to_answer: { type: Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const Game = model<IGame, IGameModel>('Game', GameSchema)

export { Game, IGame, IGameOnly, IGameAttributes }
