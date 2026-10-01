import express from "express";
import dotenv from "dotenv";
import orderRoutes from "./routes/orders";

dotenv.config();
const app = express();
app.use( express.json() );

app.use( '/' , orderRoutes);

const PORT: number = 3000;
app.listen(PORT, ()=>{
    console.log(`Server is running successfully on port : ${PORT}`)
});