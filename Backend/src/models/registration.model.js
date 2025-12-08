import mongoose from 'mongoose';
const { Schema } = mongoose;

const registrationSchema= new Schema(
    {
    eventId:{
       type:Schema.Types.ObjectId,
       required:true,
       unique:true,
       ref:"Event"
     },

    userId:{
       type:Schema.Types.ObjectId,
       required:true,
       unique:true,
       ref:"User"
     },

    registrationTime:{
       type: Date,
       default: Date.now,
       required: true,
     },

    status:{
        type: String,
        enum: ["registered", "not registered"],
        default: "not registered",
        required: true,
     },

    qrCodeData:{
        type:String,
        required:true,
        unique:true
     },

    checkedIn:{
        type:Boolean,
        default:false,
        required:true,
     },

     checkInTime: {
      type: Date,
    },
    } ,

 {
    timestamps:true
 }
)

export const registration = mongoose.model("Registration", registrationSchema);
