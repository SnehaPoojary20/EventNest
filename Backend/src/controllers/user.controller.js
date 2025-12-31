import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { passwordValidator } from "../utils/passwordValidator.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId)=>{

    try {
        const user= await User.findById(userId);

        if (!user) {
         throw new ApiError(404, "User not found");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500,"Something Went Wrong while generating refresh and access token")
    }

  }



const registerUser = asyncHandler(async (req,res)=>{

  console.log("req.body:", req.body);
  console.log("req.files:", req.files);

  const normalizedBody = {};

for (let key in req.body) {
  normalizedBody[key.trim()] = req.body[key];
}

  // const { username, email, password } = req.body;
  const {username,email , password, role, department, year} = normalizedBody;
    
 if (
  [username, email, password, role, department].some(
    field => !field || field.trim() === ""
  ) ||
  !year
) {
  throw new ApiError(400, "All fields are required");
}
 
  if (!passwordValidator(password)) {
    throw new ApiError(
      400,
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
    );
  }

// if user exists already
const existingUser = await User.findOne(
  {
    $or:[{username:username.toLowerCase()},
         {email:email.toLowerCase()}]
  }
)

if(existingUser){
  throw new ApiError(409, "User with same username or email exists")
}

let profilePicLocalPath;

if(req.files && req.files.profilePic  && req.files.profilePic.length>0){
  profilePicLocalPath = req.files.profilePic[0].path;
  }

if(! profilePicLocalPath){
  throw new ApiError(400,"Profile pic is required ")
}

const uploadedProfilePic = await uploadToCloudinary(profilePicLocalPath);


if(! uploadedProfilePic?.url){
  throw new ApiError(500, " Profile pic upload failed")
}

// create user
const user = await User.create ({
  username: username.trim().toLowerCase(),
  email: email.trim().toLowerCase(),
  password,
  profilePic:uploadedProfilePic.url,
  role,
  department,
  year
})

const createdUser = await User.findById(user._id)
                    .select("-password -refreshToken")


if(! createdUser){
  throw new ApiError(500, "Something went wrong while registrating")
}

return res
.status(201)
.json( new ApiResponse(201, createdUser, " New User created sucessfully"))
})



const loginUser = asyncHandler(async(req,res)=>{

  const{username , email,password} = req.body;
  
  if(! (username || email) || ! password ){
    throw new ApiError(400, "All feilds are required")
  }

  const user = await User.findOne(
    {
      $or:[
        {username:username?.toLowerCase()},
        { email:email?.toLowerCase()}
      ]
    }
  )

  if(! user){
    throw new ApiError(404, "User does not exist")
  }

  const validPassword = await user.isPasswordCorrect(password)

  if(! validPassword){
    throw new ApiError(401, " Invalid User Credentials")
  }

  const{ accessToken,refreshToken}= await generateAccessAndRefreshToken(user._id)

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
  
  const options ={
    httpOnly: true,    // prevents JS from reading cookie
    secure: process.env.NODE_ENV === "production",     // must be false on localhost
    sameSite: "lax"    // prevents some CSRF, works fine locally
  }

 return  res
.status(200)
.cookie("accessToken", accessToken, options)
.cookie("refreshToken", refreshToken, options)
.json(
    new ApiResponse(
      200,
      {
        user: loggedInUser,
        accessToken,
      },
      "Logged in successfully"
    )
  );
});  



const logoutUser = asyncHandler(async(req,res)=>{

 await User.findByIdAndUpdate(
  req.user._id,
  {
    $set:{
         refreshToken:undefined
    }
  },{
      new:true
    }
 )
  
  const options={
    httpOnly: true,   
    secure: process.env.NODE_ENV === "production",     
    sameSite: "lax"    
  }

  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200,{},"User Logged Out"))
 
})



const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    throw new ApiError(400, "All fields are required");
  }

  if (oldPassword === newPassword) {
    throw new ApiError(400, "New password must be different from old password");
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "New password and confirm password should be same");
  }

  if (!passwordValidator(newPassword)) {
    throw new ApiError(
      400,
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
    );
  }

  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isValid = await user.isPasswordCorrect(oldPassword);
  if (!isValid) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  user.refreshToken = undefined; // logout all devices
  await user.save();

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  };

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password changed successfully"));
});



const getCurrentUser = asyncHandler (async (req,res)=>{

  const user = await User.findById(req.user?._id)
              .select("-password -refreshToken");

   if(! user){
    throw new ApiError(404, "User does not exist")
   }

   return res
  .status(200)
  .json(new ApiResponse(200, user, "User found successfully !!"))
})



const updateProfilePic = asyncHandler (async (req,res)=>{

  const profilePicPath = req.file?.path

  if(! profilePicPath){
    throw new ApiError(400,"Profile picture is missing")
  }

  const uploadedProfilePic = await uploadToCloudinary(profilePicPath);

    if (!uploadedProfilePic?.url) {
    throw new ApiError(500, "Profile picture upload failed");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
       profilePic: uploadedProfilePic.url
      }
    },{
      new:true
    }
  ).select("-password -refreshToken")

    if (!user) {
    throw new ApiError(404, "User not found");
  }

   return res
  .status(200)
  .json(new ApiResponse(200, user, "Profile picture updated successfully"));

})



const updateAccountDetails = asyncHandler(async (req, res) => {

  const updates={};

  if(req.body.username) updates.username = req.body.username.toLowerCase();
  if(req.body.email)updates.email=req.body.email.toLowerCase();
  if(req.body.department)updates.department= req.body.department.toLowerCase();
  if (req.body.year) updates.year = Number(req.body.year);

  if(Object.keys(updates).length === 0){
      throw new ApiError(400, "At least one field is required");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {$set :updates},
    {new:true}
  ).select("-password -refreshToken")

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200, updatedUser, "Account details updated successfully")
  );
});


export {registerUser, generateAccessAndRefreshToken, loginUser, logoutUser, changeCurrentPassword, getCurrentUser, updateProfilePic, updateAccountDetails}

// generate access and refresh token
// register user
// login user
// logout user
// change current password
// get current user
// change current profile pic 