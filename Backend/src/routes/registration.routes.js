import {Router} from "express"
import {createRegistration,getMyRegistrations,unregisterFromEvent,getEventRegistrations,
} from "../controllers/registration.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"


const router = Router();

router.post("/register_for_event", verifyJWT, createRegistration);
router.get("/user_registrations", verifyJWT, getMyRegistrations);
router.delete("/unregister/:eventId", verifyJWT, unregisterFromEvent);
router.get("/admin/all_registrations/:eventId", verifyJWT, getEventRegistrations);

export {router};