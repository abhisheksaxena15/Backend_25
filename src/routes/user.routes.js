// create routor over here

import {Router} from 'express';
import { registerUser } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

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

export default router;