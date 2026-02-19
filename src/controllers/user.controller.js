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


// generate access token and refresh token - we can generate them in controller but it is better to generate them in model because if we want to use them in other places like in middleware for authentication then we can easily use them without writing the same code again and again so it is better to keep them in model as instance methods and we can call them on user instance
const generateAccessAndRefreshTokens = async (userId) => {
    try{
        console.log("Finding user with ID:", userId);
        const user = await User.findById(userId)
        console.log("User found:", user ? "Yes" : "No");
        
        // console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET);
        // console.log("REFRESH_TOKEN_SECRET:", process.env.REFRESH_TOKEN_SECRET);
        
      const accessToken = await user.generateAccessToken()
const refreshToken = await user.generateRefreshToken()

        // console.log("Generated accessToken (raw):", accessToken);
        // console.log("Generated refreshToken (raw):", refreshToken);

        user.refreshToken = refreshToken;
        await user.save({
            validateBeforeSave: false
        });

        return {
            accessToken,
            refreshToken
        }

    }
    catch(error) {
        console.error("Error generating tokens --> ", error);
        throw new ApiError("Error generating refesh and access tokens", 500);
    }
}

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

const loginUser = asyncHandler(async (req, res) => {
    // req.body -data
    // user name or email 
    // password
    // find user in db with email or username
    // password check
    // access token and refresh token generate to user
    // send them in cookie 



    // req.body -data
    const  { username , email , password} = req.body;

     if (!email && !username) {
        throw new ApiError("Email or username is required", 400);
    }
    
    const user = await User.findOne({
        $or: [{ email }, { username }]   // either email or username can be used to login , there looking for any one of them
    })

    if( !user){
        throw new ApiError("User not found", 404);
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid) {
        throw new ApiError("Invalid user credentials/password", 401);
    }

    // generate access token and refresh token
    console.log("Generating tokens for user ID:", user._id);
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)
    // console.log("Generated accessToken:", accessToken);
    // console.log("Generated refreshToken:", refreshToken);
    const loggedInUser = await User.findById(user._id).select(
        '-password -refreshToken'
    );

    // cookies are used to store refresh token in browser and access token is sent in response body and stored in frontend (local storage or memory) and sent with each request in headers for authentication and authorization
    const option = {
        httpOnly: true, // When I put tokens into cookies, I want to control how the browser treats those cookies - no javascript access
        secure : false, // Only send this cookie over HTTPS connections No encryption? No cookie..
SameSite: "lax",
 path: "/"   // ⭐ MUST MATCH

    }
    return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
        new ApiResponse(200, { user: loggedInUser, accessToken }, "User logged in successfully") // {} <- this is datahere
        // we are sending access token in response body also because we need to store it in frontend and send it with each request for authentication and authorization and refresh token is stored in cookie and sent with each request automatically by the browser 
     )  
})


// logout user - we will clear the cookie and remove refresh token from db
const logoutUser = asyncHandler(async (req, res) => {
    // find user by id and update refresh token to null
    
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true // return updated document
        }
    )

    const options = {
        httpOnly: true, // When I put tokens into cookies, I want to control how the browser treats those cookies - no javascript access
        secure : false, // Only send this cookie over HTTPS connections No encryption? No cookie..
SameSite: "lax",
 path: "/"   // ⭐ MUST MATCH
  //   secure: process.env.NODE_ENV === "production",

    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"))
})

export { 
    registerUser,
    loginUser,
    logoutUser
};