import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {Registration} from "../models/registration.model.js"
import { uploadToCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { passwordValidator } from "../utils/passwordValidator.js";
import jwt from "jsonwebtoken";

const createRegistration = asyncHandler (async (req,res)=>{

})



const getMyRegistrations =asyncHandler(async(req,res)=>{

})



const unregisterFromEvent = asyncHandler (async(req,res)=>{

})



const getEventRegistrations = asyncHandler(async(req,res)=>{

})



const deleteRegistration = asyncHandler(async(req,res)=>{

})


export{
    createRegistration,getMyRegistrations,unregisterFromEvent,getEventRegistrations,
deleteRegistration }


//create registration form
//user register
// Fetch all events a student has registered for
// unregister
//getEventRegistrations (Admin / Organizer)
// deleteRegistration (Admin Only)