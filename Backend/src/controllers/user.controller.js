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
  const {username,email , password, role, departement, year} = normalizedBody;
    
 if (
  [username, email, password, role, departement].some(
    field => !field || field.trim() === ""
  ) ||
  !year
) {
  throw new ApiError(400, "All fields are required");
}
 
// if user exists already
const existingUser = await User.findOne(
  {
    $or:[{username},{email}]
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
  username: username.toLowerCase(),
  email:email.toLowerCase(),
  password,
  profilePic:uploadedProfilePic.url,
  role,
  departement,
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



const changeCurrentPassword = asyncHandler (async (req,res)=>{

})



const getCurrentUser = asyncHandler (async (req,res)=>{

})



const profilePic = asyncHandler (async (req,res)=>{

})



export { generateAccessAndRefreshToken, loginUser, logoutUser, changeCurrentPassword, getCurrentUser, profilePic}

// generate access and refresh token
// register user
// login user
// logout user
// change current password
// get current user
// change current profile pic 