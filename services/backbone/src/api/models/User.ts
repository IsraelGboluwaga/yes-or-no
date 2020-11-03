import { Document, Model, model, Schema } from 'mongoose'

interface IUserOnly {
  username: string
  password: string
}

interface IUserAttributes extends IUserOnly {
  _id: string
}

interface IUser extends Document, IUserOnly {}
interface IUserModel extends Model<IUser> {}

const userSchema = new Schema(
  {
    username: { type: String, unique: true },
    password: String,
  },
  { timestamps: true }
)

const User = model<IUser, IUserModel>('User', userSchema)

export { User, IUser, IUserOnly, IUserAttributes }
