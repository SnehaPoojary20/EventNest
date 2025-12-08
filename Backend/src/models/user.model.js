import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema(
   {

   username:{
     type:String,
     required:true,
     trim:true,
     lowercase:true,
     unique:true
   },

   email:{
     type:String,
     required:true,
     trim:true,
     lowercase:true,
     unique:true
   },

   password:{
      type:String,
      required:[true, 'Password is required']
   },

   role:{
      type: String,
      enum: ["student", "organizer", "admin"],
      default: "student",
      required: true,
   },

   departement:{
    type:String,
    required:true,
    trim: true,
   },

   year:{
      type: Number,
      required: true,
      min: 1,
      max: 4,
   }
},
{
    timestamps:true
}
);

export const user = mongoose.model("User", userSchema);