import {Router} from "express"
import {getMyAdminLogs} from "../controllers/adminActivityLog.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"


const router = Router();

router.route("/admin/logs/me").get(verifyJWT,getMyAdminLogs);

export{router}