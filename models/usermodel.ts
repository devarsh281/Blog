import mongoose, { Schema, Document, Model } from "mongoose";
import { z } from "zod";

export interface IUser extends Document {
  username: string;
  password: string;
  role?: string; 
}
export const UserSchemaZod = z.object({
  username: z.string(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long"),
  role: z.string().optional(),
});
const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
  
    },
    role: {
      type: String,
      default: "user",
    },
  },
);

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;
