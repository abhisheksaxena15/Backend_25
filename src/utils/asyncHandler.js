const x = (requestHandler) =>{
    async (req, res, next) => {
     Promise
     .resolve(requestHandler(req, res, next))
     .catch((err)=> next(err))
    }
}

/*
In async code:

await User.find(); // error here


Express does NOT catch it automatically.

Why?
Because:

Async functions return Promises

Express doesn’t watch promise rejections by default
*/



//a wrapper funciton which will be ued to wrap each controller function
// will be used everywehere further 


// I
// m
// p
// t


/*
const asyncHandler = (fn) => async (req, res, next) => {
    try {

    } catch (error) {
        res.status(err.code || 500).json({
            success: false,
            message: err.message || " Internal Server Error "
        })
    }
}*/





//important 

✅ HOW asyncHandler FIXES THIS
app.get(
  "/users",
  asyncHandler(async (req, res) => {
    if (!user) {
      throw new ApiError("User not found", 404);
    }
  })
);
/*

Now the flow is:

app.get(
  "/users",
  asyncHandler(async (req, res) => {
    if (!user) {
      throw new ApiError("User not found", 404);
    }
  })
);





ApiError thrown
     ↓
Promise rejects
     ↓
asyncHandler catches
     ↓
next(err)
     ↓
error middleware sends response

🧠 SIMPLE MEMORY RULE (REMEMBER THIS)

❌ ApiError = Error TYPE
✅ asyncHandler = Error CATCHER

You throw ApiError
You catch with asyncHandler

*/