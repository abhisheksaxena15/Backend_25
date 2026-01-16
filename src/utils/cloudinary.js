import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload an image

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null;
        }
        const respone = await  cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto' //video or image
        })
        console.log('File uploaded to Cloudinary successfully' , respone.url);
        return respone;
    }
     catch (error) {
        fs.unlinkSync(localFilePath); // Delete the local file from server in case of error as well as to avoid malicious activity
        console.error('Error uploading file to Cloudinary: ', error);
        throw error;
    }
};


export {uploadOnCloudinary};