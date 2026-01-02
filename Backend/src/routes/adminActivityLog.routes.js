import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"


const router = Router();

router.get("/admin/logs/me", verifyJWT, getMyAdminLogs);

export{router}