import mongoose, { Document, Model, Schema } from "mongoose";

export interface Icat extends Document{
  id:number,
  name:string;
}

const CategorySchema :Schema = new Schema({
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

const Category:Model<Icat>=mongoose.model<Icat>("Category",CategorySchema);
export default Category;
