import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId)=>{

    try {
        const user= await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

    } catch (error) {
        throw new ApiError(500,"Something Went Wrong while generating refresh and access token")
    }
}


export { generateAccessAndRefreshToken}
// generate access and refresh token
// register user
// login user
// logout user
// change current password
// get current user
// change current profile pic 