const mongoose = require("mongoose");
const keys = require("../config/keys");

const connection = async () => {
  try {
    await mongoose.connect(keys.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database connected successfully!");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connection;
