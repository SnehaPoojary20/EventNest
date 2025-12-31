import {Router} from "express"
import {generateAccessAndRefreshToken, loginUser, logoutUser, changeCurrentPassword, getCurrentUser, updateProfilePic, updateAccountDetails,registerUser} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/change-password").patch(verifyJWT,changeCurrentPassword);
router.route("/change-profilePic")
  .patch(
    verifyJWT,
    upload.single("profilePic"),
    updateProfilePic
  );
router.route("/update_account_details").patch(verifyJWT,updateAccountDetails);
router.route("/me").get(verifyJWT, getCurrentUser);

export default router;