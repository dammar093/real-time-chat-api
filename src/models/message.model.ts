import { Schema, model, Document } from "mongoose";

export interface IMessage extends Document {
  _id: string,
  message?: string,
  file?: string,
  sender: Schema.Types.ObjectId,
  receiver: Schema.Types.ObjectId
}

export const MessageSchem = new Schema<IMessage>({
  message: {
    type: String,
  },
  file: {
    type: String
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
}, {
  timestamps: true
})

const Message = model<IMessage>("Message", MessageSchem);

export default Message;
