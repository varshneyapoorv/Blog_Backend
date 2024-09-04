const mongoose = require('mongoose');


const connectDB= async()=>{
     try{
            await mongoose.connect(process.env.MONGODB_URL)
            console.log(`MongoDB Connected ${mongoose.connection.host}`);
     }catch(error){
        console.log(`MongoDB Error ${error}`);
     }
}

module.exports = connectDB;