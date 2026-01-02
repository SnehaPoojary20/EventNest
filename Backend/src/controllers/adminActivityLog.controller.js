import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { AdminActivity } from "../models/adminActivityLog.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getMyAdminLogs = asyncHandler(async (req, res) => {
  const user = req.user;

  // Only admin can see his own logs
  if (!user || user.role !== "admin") {
    throw new ApiError(403, "Access denied");
  }

  const logs = await AdminActivity.find({
    adminId: user._id
  })
    .populate("eventId", "title eventDate")
    .sort({ createdAt: -1 });

  return res
  .status(200)
  .json(
    new ApiResponse(200, logs, "Your logs fetched successfully")
  );
});

export { getMyAdminLogs };
