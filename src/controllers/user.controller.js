import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import {uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

/**
 * 
 * What is the controllers folder?
Controller = Business Logic

Controllers contain:

            ------------WHAT should happen when an API is called

Validation
Database calls
Errors
Final response

They do not define URLs
They do not start the server

They only handle requests.

📄 What is user.controller.js?

This file handles user-related logic, like:

Register user
Login user
Update profile
Get user data

👉 It answers the question:

“When /register is hit, WHAT should the server do?”

 * POST /register
        ↓
route file
        ↓
controller (your file)
        ↓
DB + response

 */
//asyncHandler wrapper function - is a function that accepts other function and handles error so we dont have to use try catch in every controller and promise rejections are handled

const registerUser = asyncHandler(async (req, res) => {
    // Registration logic hereeee


    // get user details form  frontend - can be found in req.body  / can be from url /  can be from form
    const { fullName, email, username, password } = req.body;
    console.log("email", email);

    // if( fullName === "" || email === "" || username === "" || password === "" ) {
    //     throw new ApiError("Field is required", 400);
    // }

    if ([fullName, email, username, password].some((fields) => {
        (field) => (field ?? "").trim() === ""
    })) {
        throw new ApiError("All fields are required", 400);
    }

    // check if user already exists that matches with email or username
    const existedUser = await User.findOne({ 
        $or: [{ email }, { username }] 
    })
    console.log("existedUser --> ", existedUser);
    if (existedUser) {
        throw new ApiError("User already exists with this email or username", 409);
    }

    //req.body 
    //check for images and avatar in req.files ( req.files is given by multer middleware after file upload )


    // LOCALPATH ?? BECZ it is on server only not on cloudinary
    const avatarLocalPath = req.files?.avatar?.[0]?.path // [0] -  will get its first property coz in that there from multer we get object and if not we will get path 
    // will get path which is uploaded byjj multer 
    //const coverImageLocalPath = req.files?.coverImage?.[0]?.path

    
    
    // dhekcing wheather cover image is present or not locally
    let coverImageLocalPath; 
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }


    if (!avatarLocalPath) {
        throw new ApiError("Avatar file is required", 400);
    }

    // upload them to cloudniary  or aws etc both of them
    const avatar = await uploadOnCloudinary(avatarLocalPath); // IT take time to upload so - await
    console.log("avatar upload response --> ", avatar);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    console.log("coverImage upload response --> ", coverImage);

    /*
    ✔ Moves files from local server → cloud
    ✔ Gets public URLs
    ✔ Removes dependency on local storage
     */
    if( !avatar?.url ) {
        throw new ApiError("Error uploading avatar image", 400);

    }

    if(!coverImage?.url ) {
        throw new ApiError("Error uploading cover image", 400);
    }

    // create user in db
    const user = await User.create({
        fullName,
        avatar : avatar.url,  // need only url other wise whole object will go 
        coverImage : coverImage?.url || "",
        email,
        username : username.toLowerCase(),
        password
    })
    console.log("Newly created user --> ", user);

    //to check wheater user is created or not
    const createdUser = await User.findById(user._id).select(
        '-password -refreshToken'
    ); // exclude password from the response - pass not required

    if(!createdUser) {
        throw new ApiError("SSomething went wrong while registering a user", 500);
    }
    


    //if user is created perfectly and properly --- send response
    

    //return response using proper apiresponse format
    return res.status(201).json(
        //the json response architecture is already defined in apiresponse.js file
        new ApiResponse(201, createdUser, "User registered successfully")
    )
});

export { registerUser };