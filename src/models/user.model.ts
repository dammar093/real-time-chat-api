import { Schema, Document, model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  name: string;
  profilePic: string;
}

export const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, min: 6 },
  name: { type: String, required: true },
  profilePic: {
    type: String, required: false, default: "https://www.gravatar.com/avatar/?d=identicon",
  },
});

UserSchema.pre("save", hashPassword);

const User = model<IUser>("User", UserSchema);
export default User;

export function hashPassword(this: IUser, next: () => void) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, 10);
  next();
}

export function comparePassword(password: string, hash: string) {
  return bcrypt.compareSync(password, hash);
}