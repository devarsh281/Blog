import mongoose, { Document, Model, Schema } from "mongoose";
import { z } from "zod";

export interface Icat extends Document {
  id: number;
  name: string;
}

export const CatValSchema = z.object({
  id: z.number().int().positive().optional(),
  title: z.string().min(5, "Title must be at least 5 characters long"),
});

const CategorySchema: Schema = new Schema({
  id: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const Category: Model<Icat> = mongoose.model<Icat>("Category", CategorySchema);
export default Category;
