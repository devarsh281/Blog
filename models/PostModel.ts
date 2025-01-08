import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPost extends Document {
  id: number;
  title: string;
  description: string;
  category: string;
  date?: Date;
  views: number;
  image:string;
}

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
  image:{
    type:String,
    required:true,
  }
});

const Post: Model<IPost> = mongoose.model<IPost>("Post", PostSchema);
export default Post;
