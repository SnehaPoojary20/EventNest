import mongoose from "mongoose";
const { Schema } = mongoose;

const analyticsSchema = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      unique: true, // one analytics document per event
    },

    totalRegistrations: {
      type: Number,
      default: 0,
    },

    totalCheckIns: {
      type: Number,
      default: 0,
    },

    checkInRate: {
      type: Number, // stored percentage: e.g., 70 → 70%
      default: 0,
    },

    timeSeriesData: [
      {
        time: { type: Date },
        checkIns: { type: Number, default: 0 },
      },
    ],

    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
     timestamps: true 
    }
);

export const Analytics = mongoose.model("Analytics", analyticsSchema);
