import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {Registration} from "../models/registration.model.js"
import { uploadToCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { passwordValidator } from "../utils/passwordValidator.js";
import jwt from "jsonwebtoken";



const createRegistration = asyncHandler (async (req,res)=>{

    const{ eventId, userId, registrationTime,status, qrCodeData, checkedIn, checkInTime} = req.body;

    // Basic validation
    if(! eventId || ! userId || ! status){
        throw new ApiError(400,"eventId, userId and status are required")
    }

    //prevent duplicate registration
    const existingUserRegistration = await Registration.findOne({
        eventId,
        userId
    })

    if(existingUserRegistration){
        throw new ApiError(409, "User already registered")
    }

    //create registration
    const registration = await Registration.create({
        eventId,
        userId,
        registrationTime: registrationTime || new Date(),
        status,
        qrCodeData,
        checkedIn: checkedIn || false,
        checkInTime: checkInTime || null,
    })

      //safety check
    if(! registration){
        throw new ApiError(400,"Failed to create registration")
    }
  
    return res
    .status(201)
    .json(new ApiResponse
        (201,registration,"Registration created successfully !!")
    )
})



const getMyRegistrations =asyncHandler(async(req,res)=>{

    const userId = req.user?._id;

    if(! userId){
        throw new ApiError(400, "User does not exist")
    }
   
   const myRegistrations = await Registration.find({ userId })

    if(! myRegistrations || myRegistrations.length === 0){
         throw new ApiError(404, "No registrations found");
    }

    return res
    .status(201)
    .json(new ApiResponse
        (201,myRegistrations,"Your Registrations fetched successfully")
    )
})



const unregisterFromEvent = asyncHandler (async(req,res)=>{
  
    const{eventId}= req.params;
    const userId = req.user?._id;

    if(! eventId){
        throw new ApiError(400, "Event Id is required")
    }

    if(! userId){
        throw new ApiError(401, "Unauthorized user")
    }

    const registeredEvent = await Registration.findOne(
        {eventId,userId }
    )

    if(! registeredEvent){
        throw new ApiError(404, "You are not registered for this event ")
    }

    if (registeredEvent.checkedIn) {
      throw new ApiError(400, "Cannot unregister after check-in");
    }

    await Registration.findByIdAndDelete(registeredEvent._id)

     return res
    .status(200)
    .json(new ApiResponse
        (200,null,"Successfully unregistered from event")
    )
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