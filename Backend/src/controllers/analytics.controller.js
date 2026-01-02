import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Analytics } from "../models/analytics.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import fs from "fs";


const getEventAnalytics = asyncHandler(async(req,res)=>{

})



const updateRegistrationCount = asyncHandler(async(req,res)=>{

})



const updateCheckInAnalytics = asyncHandler(async(req,res)=>{

})


const getEventSuccessSummary = asyncHandler(async(req,res)=>{

})



export{getEventAnalytics,updateRegistrationCount,updateCheckInAnalytics,getEventSuccessSummary}

//get event analytics 
//updateRegistrationCount
//updateCheckInAnalytics
//getEventSuccessSummary
//getAdminDashboardOverview