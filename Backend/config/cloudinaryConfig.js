import { v2 as cloudinary } from "cloudinary";
import {config} from 'dotenv';

config();

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = (fileBuffer, folderName = "general", resourceType = "auto") => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { 
                folder: folderName, 
                resource_type: resourceType, 
                //format: "pdf" // Explicitly force PDF
            },
            (error, result) => {
                if (result) resolve(result.secure_url);
                else reject(error);
            }
        );
        uploadStream.end(fileBuffer);
    });
};

export default cloudinary;