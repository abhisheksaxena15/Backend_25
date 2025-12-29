import mongoose from 'mongoose';
import {DB_NAME} from './constants.js';










/*

1st approach to connect to the database and start the server using iife 
2nd is creating a separate function in seperate db file and to connect to the database and then calling that function before starting the server

import express from 'express';
const app = express();

 ( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        
        //database is connected but app is not listening to requests yet
        app.on( " error " , (error)=>{
            console.error( " MongoDB connection error: " , error);
throw error;
        });

        app.listen( process.env.PORT , ()=>{
            console.log( ` Server is running on port ${ process.env.PORT } ` );
        } );
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);   
        throw error;
    }
 }) ()*/