import mongoose from 'mongoose';
const { Schema } = mongoose;

const registrationSchema= new Schema(
    {
    eventId:{
       type:Schema.Types.ObjectId,
       required:true,
       ref:"Event"
     },

    userId:{
       type:Schema.Types.ObjectId,
       required:true,
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
     },

     checkInTime: {
      type: Date,
    },
    } ,

 {
    timestamps:true
 }
)

// One user can register only once per event
registrationSchema.index({ eventId: 1, userId: 1 }, { unique: true });

export const registration = mongoose.model("Registration", registrationSchema);
