const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGODB_URL);
    if (con.connection.readyState === 1) {
      console.log("DB connection successfully");
    } else {
      console.log("DB connecting");
    }
  } catch (error) {
    console.log("DB conection failed");
    throw new Error(error);
  }
};
module.exports = connectDB;
