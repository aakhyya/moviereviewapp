const mongoose = require("mongoose");

const mongoUri = process.env.MONGO_URI;

async function connectToMongoDB() {
  if (!mongoUri) {
    throw new Error("MONGO_URI not defined");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");
}

module.exports = connectToMongoDB;
