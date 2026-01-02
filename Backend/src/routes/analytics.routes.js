import {Router} from "express"
import {getEventAnalytics,updateRegistrationCount,updateCheckInAnalytics,getEventSuccessSummary} from "../controllers/analytics.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/analytics/:eventId").get(verifyJWT,getEventAnalytics)
router.route("/analytics/:eventId/registration").put(verifyJWT,updateRegistrationCount)
router.route("/analytics/:eventId/checkin").put(verifyJWT,updateCheckInAnalytics)
router.route("/analytics/:eventId/summary").get(verifyJWT,getEventSuccessSummary)

export{}