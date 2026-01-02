import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Feedback } from "../models/feedback.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import fs from "fs";



const writeFeedback = asyncHandler(async (req, res) => {

  const { eventId } = req.params;
  const { rating, comment, taggedUsers = [] } = req.body;
  const userId = req.user?._id;

  if (!eventId) {

    throw new ApiError(400, "Event ID is required");
  }

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  if ( rating === undefined || !comment) {
     throw new ApiError(400, "Rating and comment required");
  }

  if (rating < 1 || rating > 5) {
    throw new ApiError(400, "Rating must be between 1 and 5");
  }

  const existing = await Feedback.findOne({ eventId, userId });
  if (existing) {
    throw new ApiError(409, "Feedback already submitted for this event");
  }

  const images = [];
  if (req.files?.length) {
    for (const file of req.files) {
      const url = await uploadToCloudinary(file.path);
      if (url) images.push({ url });
      fs.existsSync(file.path) && fs.unlinkSync(file.path);
    }
  }

  const feedback = await Feedback.create({
    eventId,
    userId,
    rating,
    comment,
    taggedUsers,
    images
  });

  return res
  .status(201)
  .json(
    new ApiResponse(201, feedback, "Feedback created successfully")
  );
});



const updateFeedback = asyncHandler(async (req, res) => {

  const { eventId, feedbackId } = req.params;
  const userId = req.user?._id;
  const { rating, comment, taggedUsers } = req.body;

  if (!eventId || !feedbackId) {
    throw new ApiError(400, "Event ID and Feedback ID are required");
  }

  const feedback = await Feedback.findOne({ _id: feedbackId, eventId });

  if (!feedback) {
    throw new ApiError(404, "Feedback not found");
  }

  if (feedback.userId.toString() !== userId.toString()) {
    throw new ApiError(403, "Forbidden");
  }

  if (rating !== undefined) {

    if (rating < 1 || rating > 5) {
      throw new ApiError(400, "Rating must be between 1 and 5");
    }
    feedback.rating = rating;
  }

  if (comment !== undefined) feedback.comment = comment;
  if (taggedUsers !== undefined) feedback.taggedUsers = taggedUsers;

  
  if (req.files?.length) {
    for (const file of req.files) {
      const url = await uploadToCloudinary(file.path);
      if (url) feedback.images.push({ url });
      fs.existsSync(file.path) && fs.unlinkSync(file.path);
    }
  }

  await feedback.save();

  return res
  .status(200)
  .json(
    new ApiResponse(200, feedback, "Feedback updated successfully")
  );
});



const deleteFeedback = asyncHandler(async (req, res) => {

  const { eventId, feedbackId } = req.params;
  const userId = req.user?._id;

  const feedback = await Feedback.findOne({ _id: feedbackId, eventId });

  if (!feedback) {
    throw new ApiError(404, "Feedback not found");
  }

  if (feedback.userId.toString() !== userId.toString()) {
    throw new ApiError(403, "Forbidden");
  }

  await feedback.deleteOne();

  return res
  .status(200)
  .json(
    new ApiResponse(200, null, "Feedback deleted successfully")
  );
});



const getFeedbackByEvent = asyncHandler(async (req, res) => {

  const { eventId } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 10, 50);

  const feedbacks = await Feedback.find({ eventId })
    .populate("userId", "name avatar")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return res
  .status(200)
  .json(
    new ApiResponse(200, feedbacks, "Feedbacks fetched successfully")
  );
});



const getMyFeedbacks = asyncHandler(async (req, res) => {

  const userId = req.user?._id;

  const feedbacks = await Feedback.find({ userId })
    .populate("eventId", "title date")
    .sort({ createdAt: -1 });

  return res
  .status(200)
  .json(
    new ApiResponse(200, feedbacks, "User feedbacks fetched successfully")
  );
});

export {
  writeFeedback,
  updateFeedback,
  deleteFeedback,
  getFeedbackByEvent,
  getMyFeedbacks
};



// write feedback
// update feedback
// delete feedback