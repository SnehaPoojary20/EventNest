import mongoose from "mongoose";
const { Schema } = mongoose;

const feedbackSchema = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Prevent same user giving feedback twice for same event
feedbackSchema.index({ eventId: 1, userId: 1 }, { unique: true });

export const Feedback = mongoose.model("Feedback", feedbackSchema);
