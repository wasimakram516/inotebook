const mongoose = require("mongoose");
const mongoURI = "mongodb://localhost:27017";

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI, {
      // Your options if you have any
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Could not connect to MongoDB", error);
  }
};

module.exports = connectToMongo;
