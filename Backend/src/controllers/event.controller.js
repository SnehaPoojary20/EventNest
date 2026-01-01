import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {Event} from "../models/event.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { title } from "process";



const createEvent = asyncHandler(async (req, res) => {
  const user = req.user;

  if (user.role !== "admin") {
    throw new ApiError(403, "You cannot create an event");
  }

  // Normalize request body keys
  const normalizedBody = {};
  for (let key in req.body) {
    normalizedBody[key.trim()] = req.body[key];
  }

  const {
    title,
    description,
    eventDate,
    eventTime,
    venue,
    bannerImage,
    capacity,
    registrationDeadline,
    tags,
    collegeRestricted,
  } = normalizedBody;

  // Required string fields
  if (
    !title ||
    !description ||
    !eventTime ||
    !venue ||
    !bannerImage
  ) {
    throw new ApiError(400, "All required fields must be provided");
  }

  // Required date fields
  if (!eventDate || !registrationDeadline) {
    throw new ApiError(400, "Event date and registration deadline are required");
  }

  // Boolean check (IMPORTANT)
  if (collegeRestricted === undefined) {
    throw new ApiError(400, "collegeRestricted field is required");
  }

  // Prevent duplicate event (same title + date)
  const existingEvent = await Event.findOne({ title, eventDate });

  if (existingEvent) {
    throw new ApiError(400, "Event already exists");
  }

  const event = await Event.create({
    title,
    description,
    organizerId: user._id,
    eventDate,
    eventTime,
    venue,
    bannerImage,
    capacity,
    registrationDeadline,
    tags,
    collegeRestricted,
  });

  if (!event) {
    throw new ApiError(500, "Sorry, could not create event");
  }

  return res
  .status(201)
  .json(
    new ApiResponse(201, event, "Event created successfully")
  );
});



const updateEventDetails = asyncHandler(async(req,res)=>{

  const user = req.user;
  const { eventId } = req.params;

  if (user.role !== "admin") {
    throw new ApiError(403, "You cannot update event details");
  }

  if (!eventId) {
    throw new ApiError(400, "Event ID is required");
  }

    const updates = {};

  if (req.body.title !== undefined) updates.title = req.body.title;
  if (req.body.description !== undefined) updates.description = req.body.description;
  if (req.body.eventDate !== undefined) updates.eventDate = req.body.eventDate;
  if (req.body.eventTime !== undefined) updates.eventTime = req.body.eventTime;
  if (req.body.venue !== undefined) updates.venue = req.body.venue;
  if (req.body.bannerImage !== undefined) updates.bannerImage = req.body.bannerImage;
  if (req.body.registrationDeadline !== undefined)
    updates.registrationDeadline = req.body.registrationDeadline;
  if (req.body.capacity !== undefined) updates.capacity = req.body.capacity;
  if (req.body.collegeRestricted !== undefined)
    updates.collegeRestricted = req.body.collegeRestricted;

      if(Object.keys(updates).length === 0){
          throw new ApiError(400, "At least one field is required");
  }

  const updateEvent = await Event.findByIdAndUpdate(
    eventId,
    { $set: updates },
    { new: true, runValidators: true }
  )

  if(! updateEvent){
    throw new ApiError(400, "Could not update event details")
  }

   return res
   .status(200)
   .json(
    new ApiResponse(200, updateEvent, "Event updated successfully")
  );

})



const deleteEvent = asyncHandler(async(req,res)=>{

  const user = req.user;
  const { eventId } = req.params;

  if (user.role !== "admin") {
    throw new ApiError(403, "You cannot delete event ");
  }

  if (!eventId) {
    throw new ApiError(400, "Event ID is required");
  }

  const deletedEvent = await Event.findByIdAndDelete(eventId);

  if (!deletedEvent) {
    throw new ApiError(404, "Event not found");
  }

   return res
   .status(200)
   .json(
    new ApiResponse(200, null, "Event deleted successfully")
  );

})



const searchEvents = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    throw new ApiError(400, "Search query is required");
  }

  const events = await Event.find({
    title: { $regex: q, $options: "i" }
  });

  return res.status(200).json(
    new ApiResponse(200, events, "Event fetched successfully")
  );
});




const getAllEvents = asyncHandler(async(req,res)=>{

  const {page=1 , limit=10}= req.query;

  const events = await Event.find()
   .sort({createdAt:-1})
   .skip((page - 1) * limit)
   .limit(Number(limit));

    return res
    .status(200)
    .json(
    new ApiResponse(200, events, " All Events fetched successfully")
  );
})



const filterEvents = asyncHandler(async(req,res)=>{

    const {
    sort,
    organizer,
    collegeRestricted,
    date,
    startDate,
    endDate,
  } = req.query;

  const filter = {};

  if(organizer){
    filter.organizerId = organizer
  }

  if(collegeRestricted){
     filter.collegeRestricted = collegeRestricted === "true";
  }

  if (date) {
    const selectedDate = new Date(date);
    filter.eventDate = {
      $gte: selectedDate,
      $lt: new Date(selectedDate.setDate(selectedDate.getDate() + 1)),
    };
  }

  if (startDate && endDate) {
    filter.eventDate = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  let sortOption = { createdAt:-1}

   if (sort === "oldest") {
    sortOption = { createdAt: 1 };
  } else if (sort === "date") {
    sortOption = { eventDate: 1 };
  }

  const events = await Event.find(filter)
                            .sort(sortOption)
                            .populate("organizerId", "name email");
                        
   return res
   .status(200)
   .json(
    new ApiResponse(200, events, "Filtered events fetched successfully")
  );
})



export{createEvent,updateEventDetails,deleteEvent,searchEvents,getAllEvents,filterEvents}

//create event
//update details
// delete event
//getEventById
//getAllEvents
//getUpcomingEvents
//getEventsByOrganizer
//getEventRegistrations
//searchEvents
//filter events
