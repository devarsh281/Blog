import mongoose, { Schema, Document, Model } from "mongoose";
import { z } from "zod";

export interface ICounter extends Document {
  name: string;
  value: number;
}

export const CountSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters long"),
  value: z.number().positive().int(),
});


const CounterSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: Number,
    required: true,
    default: 0,
  },
});

const Counter: Model<ICounter> = mongoose.model<ICounter>("Counter", CounterSchema);
export default Counter;
