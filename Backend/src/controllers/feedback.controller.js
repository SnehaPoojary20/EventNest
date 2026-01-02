import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { AdminActivity } from "../models/adminActivityLog.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Feedback} from "../models/feedback.model.js"
import {uploadToCloudinary} from "../utils/cloudinary.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { AdminActivity } from "../models/adminActivityLog.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Feedback} from "../models/feedback.model.js"
import {uploadToCloudinary} from "../utils/cloudinary.js"
import fs from "fs";



const writeFeedback = asyncHandler(async(req,res)=>{
    const {eventId}= req.params
    const user = req.user
    const { rating, comment, taggedUsers} = req.body;

    if(! eventId){
        throw new ApiError(400, "Event Id is required")
    }

    if(! user){
        throw new ApiError(401, "Unauthorized user")
    }

    if (!rating || !comment) {
        throw new ApiError(400, "Rating and comment are required");
    }

    let imageUrls =[];

    if(req.files && req.files.length>0){
        for (const file of req.files) {
            const url = await uploadToCloudinary(file.path);
           if(url) imageUrls.push(url);
           fs.existsSync(file.path) && fs.unlinkSync(file.path);
        }
    }

    const feedback = await Feedback.create({
        eventId,
        userId:user._id,
        rating,
        comment,
        taggedUsers,
        images:imageUrls
    })

    
   return res
  .status(201)
  .json(
    new ApiResponse(201, feedback, "Feedback created successfully")
  );

})



const updateFeedback = asyncHandler(async(req,res)=>{

    const {eventId}= req.params
    const user = req.user
    const { rating, comment, taggedUsers, images } = req.body;

    if(! eventId){
        throw new ApiError(400, "Event Id is required")
    }

    if(! user){
        throw new ApiError(401, "Unauthorized user")
    }

})



const deleteFeedback = asyncHandler(async(req,res)=>{

})



const getFeedbackByEvent = asyncHandler(async(req,res)=>{

})



const getMyFeedbacks = asyncHandler(async(req,res)=>{

})



export{writeFeedback,updateFeedback,deleteFeedback,getFeedbackByEvent,getMyFeedbacks}


// write feedback
// update feedback
// delete feedback