import { Document, Model, model, Schema } from 'mongoose'

interface IQuestionOnly {
  game_id: string
  text: string
  answer: string
  isAnswerCorrect?: boolean
}

interface IQuestionAttributes extends IQuestionOnly {
  _id: string
}

interface IQuestion extends Document, IQuestionOnly {}
interface IQuestionModel extends Model<IQuestion> {}

const QuestionSchema = new Schema(
  {
    game_id: { type: Schema.Types.ObjectId, ref: 'Game' },
    text: String,
    answer: String,
    isAnswerCorrect: Boolean,
  },
  { timestamps: true }
)

const Question = model<IQuestion, IQuestionModel>('Question', QuestionSchema)

export { Question, IQuestion, IQuestionOnly, IQuestionAttributes }
