const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set('strictQuery', true);

const connectDb = async () => {
    try {
       await mongoose.connect(process.env.MONGO_URI)
    } catch (error) {
      console.log(error);   
    }
}

module.exports = connectDb