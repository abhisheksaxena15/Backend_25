// create routor over here

import {Router} from 'express';
import { registerUser } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { loginUser, logoutUser } from '../controllers/auth.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
const router = Router();
router.route('/register').post(

    //middleware for file upload using multer

    //fields - when we have multiple files to upload - uses array of objects
    upload.fields([
        {
            name : "avatar",
            maxCount : 1
        },
        {
            name : "coverImage",
            maxCount : 1
        }
    ]),
    registerUser
);

router.route('/login').post(loginUser);
//secured routes - we will use verifyJWT middleware to protect these routes
router.route("/logout").post(verifyJWT, logoutUser);
export default router;