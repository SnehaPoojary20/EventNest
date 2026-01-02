import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (localFilePath) => {
    
    if (!localFilePath) return null;

    // Fix for Windows paths
    localFilePath = localFilePath.replace(/\\/g, '/');

    if (!fs.existsSync(localFilePath)) {
        console.error("File not found", localFilePath);
        return null;
    }

    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto", // supports image, video, pdf, etc.
        });

        console.log("File uploaded successfully:", response.secure_url);

        // Delete local file after successful upload
        fs.unlinkSync(localFilePath);

        return response.secure_url;
    } catch (error) {
        console.error("Cloudinary upload error:", error);

        // Optional: delete file even on error
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return null;
    }
};

export { uploadToCloudinary };
