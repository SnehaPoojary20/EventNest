import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

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

   profilePic:{
        type: String, // optional field
        default: "",
    },

   organization: {
        type: String,
        required: true,
        trim: true
   },

   role:{
      type: String,
      enum: ["student", "organizer", "admin"],
      default: "student",
      required: true,
   },

   department:{
    type:String,
    required:true,
    trim: true,
   },

   year:{
      type: Number,
      required: true,
      min: 1,
      max: 4,
   },

   refreshToken:{
        type:String
    }
},
{
    timestamps:true
}
);


userSchema.pre("save" , async function(next){

   if(! this.isModified ("password"))  return next();

   this.password= await bcrypt.hash(this.password,10);

   next()
})



userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password,this.password)
}



userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
      {
         _id: this._id,
         email: this.email,
         username: this.username,
         organization: this.organization,
         role: this.role
      },

      process.env.ACCESS_TOKEN_SECRET,
      {
         expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
    )
}



userSchema.methods.generateRefreshToken = function (){
     return jwt.sign(
      {
         _id: this._id,
      },

      process.env.REFRESH_TOKEN_SECRET,{
         expiresIn:process.env.REFRESH_TOKEN_EXPIRY
      }
     )
}



export const User = mongoose.model("User", userSchema);