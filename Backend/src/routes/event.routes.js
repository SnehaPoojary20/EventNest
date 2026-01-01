import { Router } from "express";
import {
  createEvent,
  updateEventDetails,
  deleteEvent,
  searchEvents,
  getAllEvents,
  filterEvents,
} from "../controllers/event.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/events").post(verifyJWT,
                        upload.single("bannerImage"), 
                        createEvent) 
router.route("/events/:eventId").put(verifyJWT, upload.single("bannerImage"), updateEventDetails) 
router.route("/events/:eventId").delete(verifyJWT,deleteEvent) 
router.route("/events/search").get(verifyJWT,searchEvents) 
router.route("/events").get(verifyJWT,getAllEvents)
 router.route("/events/filter").get(verifyJWT,filterEvents)

export { router };
