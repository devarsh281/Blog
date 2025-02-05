import mongoose, { Document, Model, Schema } from "mongoose"
import { z } from "zod";

export interface Icount extends Document{
    name:string,
    value:number
}
export const CatCountSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters long"),
  value: z.number().positive().int(),
});


const CategoryCounter:Schema=new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    value:{
        type:Number,
        required:true,
        default:0,
    }
})

const CatCounter:Model<Icount>=mongoose.model<Icount>("CatCounter",CategoryCounter);
export default CatCounter;
