import mongoose,  {Schema} from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Because HTTP is stateless → server does NOT remember who you are between requests.

JWT solves that problem by sending proof of identity on every request.

Example:

User logs in → get JWT → store it → send it with each request → server knows "who you are".
 */
import jwt from 'jsonwebtoken';  

const userSchema = new Schema({
    username : {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true  // Adding index for faster queries and quick searches 
    },
    email : {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullName : {
        type: String,
        required: true,
        trim: true,
        index: true  // Adding index for faster queries and quick searches
    },
    avatar:{
        type: String, // cloudinary url
        required: true
    },
    coverImage : {
        type: String //cloudinary url
    },
    watchHistory : [{
        type: Schema.Types.ObjectId,
        ref:'Video'
    }],
    password : {
        type: String,
        required: true
    }

})
//this process takes time , using next sice it is a middleware , next is the name of the flag 
userSchema.pre( "save" , async function(next){
      if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next()
})

// to chck whter the password is correct or not 
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password , this.password);
    //compare - returns a boolean value ( FALSE AND TRUE)
}
userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        //payload
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User = mongoose.model('User' , userSchema)