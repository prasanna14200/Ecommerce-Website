const mongoose = require("mongoose")


async function connectDB(){
    try{
     

        await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
    }catch(err){
         console.error("❌ MongoDB connection error:", err.message);
         process.exit(1);
        console.log(err)
    }
}

module.exports = connectDB