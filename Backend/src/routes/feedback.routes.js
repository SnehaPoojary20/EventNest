import {Router} from "express"
import {writeFeedback,updateFeedback,deleteFeedback,getFeedbackByEvent,getMyFeedbacks} from "../controllers/feedback.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js";


const router = Router();

router.route("/feedback").post(verifyJWT,
                              upload.array("images", 5),
                              writeFeedback)
router.route("/feedback/:eventId").put(verifyJWT,updateFeedback)
router.route("/feedback/:eventId").delete(verifyJWT,deleteFeedback)
router.route("/feedback/event/:eventId").get(verifyJWT,getFeedbackByEvent)
router.route("/feedback/my").get(verifyJWT,getMyFeedbacks)

export{router}