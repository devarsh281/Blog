import mongoose, { Schema, Document, Model } from "mongoose";
import { z } from "zod";

export interface IPost extends Document {
  id: number;
  title: string;
  description: string;
  category: string;
  date?: Date;
  views: number;
  image: string;
  likes: string[];
  likesCount: number;
  comments: { userId: number; text: string; dat: Date }[];
}

export const PostValidationSchema = z.object({
  id: z.number().int().positive().optional(), 
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  category: z.string().min(3, "Category must be at least 3 characters long"),
  date: z.date().optional(),
  views: z.number().default(0),
  image: z.string().url().optional(),  
  likes: z.array(z.string()).default([]),
  likesCount: z.number().default(0),
  comments: z.array(
    z.object({
      userId: z.number(),
      text: z.string().min(1, "Comment text must not be empty"),
      dat: z.date().default(() => new Date()),  
    })
  ).default([]),
});

const PostSchema: Schema = new Schema({
  id: {
    type: Number,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  views: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    required: false,
  },
  likes: {
    type: [String],
    default: [],
  },
  likesCount: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      userId: { type: Number },
      text: { type: String, required: true },
      dat: { type: Date, default: Date.now },
    },
  ],
});

const Post: Model<IPost> = mongoose.model<IPost>("Post", PostSchema);

export default Post;
