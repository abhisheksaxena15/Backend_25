import {asyncHandler} from '../helpers/asyncHandler.js';

//asyncHandler wrapper function - is a function that accepts other function and handles error so we dont have to use try catch in every controller and promise rejections are handled
const registerUser = asyncHandler( async (req, res) => {
    // Registration logic herejj
    res.status(200).json({
        message:"User registered successfully"
    })
})

export {registerUser};