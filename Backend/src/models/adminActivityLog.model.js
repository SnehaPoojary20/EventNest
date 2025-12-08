import mongoose from "mongoose";
const { Schema } = mongoose;

const adminActivitySchema = new Schema(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      required: true,
      enum: [
        "create_event",
        "update_event",
        "delete_event",
        "check_in_user",
        "send_notification",
        "update_analytics",
        "other",
      ],
    },

    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },

    metadata: {
      type: Object, // extra data about the action
      default: {},
    },
  },
  { timestamps: true }
);

export const AdminActivity = mongoose.model("AdminActivityLog", adminActivitySchema);
