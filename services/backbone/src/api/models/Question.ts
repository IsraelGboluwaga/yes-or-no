import { Document, Model, model, Schema } from 'mongoose'

interface IQuestionOnly {
  game_id: string
  text: string
  answer: string
  is_answer_correct?: boolean
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
    is_answer_correct: Boolean,
  },
  { timestamps: true }
)

const Question = model<IQuestion, IQuestionModel>('Question', QuestionSchema)

export { Question, IQuestion, IQuestionOnly, IQuestionAttributes }
