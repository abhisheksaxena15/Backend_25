import { Schema } from "mongoose";


const subscriptionSchema = new Schema({

    subscriber :{
        type : Schema.Types.ObjectId,  // the one who is subscribing
        ref : "User",
        required : true
    },
    channel : {
        type : Schema.Types.ObjectId,  // the one who is being subscribed to
    }

} , {
    timestamps : true
})

export const subscription = mongoose.Schema.model("Subscription", subscriptionSchema);