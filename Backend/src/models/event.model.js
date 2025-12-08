import mongoose from "mongoose";
const { Schema } = mongoose;

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    organizerId: {
      type: Schema.Types.ObjectId,
      ref: "User",   // reference to User model
      required: true,
    },

    eventDate: {
      type: Date,
      required: true,
    },

    eventTime: {
      type: String,   // store as "10:30 AM" or "14:00"
      required: true,
    },

    venue: {
      type: String,
      required: true,
    },

    bannerImage: {
      type: String,
      required: true,
    },

    capacity: {
      type: Number,
      default: 0,
    },

    registrationDeadline: {
      type: Date,
      required: true,
    },

    tags: {
      type: [String],  
      default: [],
    },
  },
  
  {
     timestamps: true
     }
);

export const even = mongoose.model("Event",eventSchema);
