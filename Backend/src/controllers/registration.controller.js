import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {Registration} from "../models/registration.model.js"
import { uploadToCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { passwordValidator } from "../utils/passwordValidator.js";



const createRegistration = asyncHandler(async (req, res) => {
  const { eventId, status, qrCodeData } = req.body;
  const userId = req.user?._id;

  if (!eventId || !status) {
    throw new ApiError(400, "eventId and status are required");
  }

  const existingRegistration = await Registration.findOne({
    eventId,
    userId,
  });

  if (existingRegistration) {
    throw new ApiError(409, "User already registered");
  }

  const registration = await Registration.create({
    eventId,
    userId,
    status,
    qrCodeData,
    registrationTime: new Date(),
  });

  return res.status(201).json(
    new ApiResponse(201, registration, "Registration created successfully")
  );
});



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
    .status(200)
    .json(new ApiResponse
        (200,myRegistrations,"Your Registrations fetched successfully")
    )
})



const unregisterFromEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user?._id;

  if (!eventId) {
    throw new ApiError(400, "Event ID is required");
  }

  if (!userId) {
    throw new ApiError(401, "Unauthorized user");
  }

  const registration = await Registration.findOne({ eventId, userId });

  if (!registration) {
    throw new ApiError(404, "You are not registered for this event");
  }

  if (registration.checkedIn) {
    throw new ApiError(400, "Cannot unregister after check-in");
  }

  await Registration.deleteOne({ _id: registration._id });

  return res.status(200).json(
    new ApiResponse(200, null, "Successfully unregistered from event")
  );
});



const getEventRegistrations = asyncHandler(async(req,res)=>{

    const{eventId}=req.params;
    const admin = req.user;

    if(admin.role !=="admin" ){
        throw new ApiError(403, "Only admin can view registrations");
    }

    if(! eventId){
        throw new ApiError(400, "Event Id is required");
    }

    const registrations = await Registration.find({eventId})
                          .populate("userId","username email profilePic")
                          .select("userId registrationTime")
                          .sort({registrationTime:-1});

    if(! registrations.length){
        throw new ApiError(404, "No registrations found for this event");
    }

    const formattedData = registrations.map(reg=>({
        username:reg.userId.username,
        profilePic:reg.userId.profilePic,
        registeredAt: reg.registrationTime,
    }))

  return res
  .status(200)
  .json(new ApiResponse
        (200,formattedData,"All registrations for this event")
    )

})


export{
    createRegistration,getMyRegistrations,unregisterFromEvent,getEventRegistrations
 }


//create registration form
//user register
// Fetch all events a student has registered for
// unregister
//getEventRegistrations (Admin / Organizer)
// deleteRegistration (Admin Only)