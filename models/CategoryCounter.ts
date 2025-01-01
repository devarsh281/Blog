import mongoose, { Document, Model, Schema } from "mongoose"

export interface Icount extends Document{
    name:string,
    value:number
}


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
