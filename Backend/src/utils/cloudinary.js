import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config=({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async(localFilePath)=>{

    if(!localFilePath) return null;

    localFilePath = localFilePath.replace(/\\/g, '/');

    if(! fs.existsSync(localFilePath)){
        console.error("File not found", localFilePath);
        return null;
     }

    try {

        const response = cloudinary.uploader.upload(localFilePath,
            { 
                 resource_type: "auto",
            });

            console.log("File uploaded sucessfully ", response.secure_url);

            // fs.unlinkSync(localFilePath);

    } catch (error) {
        
        console.error("Cloudinary upload error:", error);

        // if(fs.existsSync(localFilePath)){
        //    fs.unlinkSync(localFilePath);
        // }

       return null;
    }
}

export {uploadToCloudinary};