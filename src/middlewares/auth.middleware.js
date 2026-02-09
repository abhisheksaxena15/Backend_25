// this will verify whether the is there or not
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

export const verifyJWT = asyncHandler( async ( req , _ , next)=>{
    // get token from header
    try {
        const token = req.cookies.accessToken || req.header("authorization")?.replace("Bearer", "") ;
        if(!token) {
            throw new ApiError("Unauthorized, no token provided", 401);
        }
        // verify token
        const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
        
        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        )
        if(!user) {
            // discussion about frontend - vid 15 nxt 16
            throw new ApiError("Unauthorized Invalid token, user not found", 401);
        }
        req.user = user; // attach user to request object
        next();
    } catch (error) {
        throw new ApiError(error?.message || "Invalid access token", 401);
    }

})