import mongoose from "mongoose";
const { Schema } = mongoose;

const qrCheckInSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    registrationId: {
      type: Schema.Types.ObjectId,
      ref: "Registration",
      required: true,
    },

    scannedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",   // admin or organizer who scanned
      required: true,
    },

    scanTime: {
      type: Date,
      default: Date.now,
      required: true,
    },

    validityStatus: {
      type: String,
      enum: ["valid", "invalid"],
      default: "valid",
      required: true,
    },
  },
  {
     timestamps: true
  }
);

export const QrCheckIn = mongoose.model("QrCheckIn", qrCheckInSchema);
