const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchemaGoogle = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    googleId: {
      type: String,
      required: true,
    },
    credits: {
      type: Number,
      default: 0,
    },
  }, // the timestamps will automatically have created_at and updated_at fields
  {
    timestamps: true,
  }
);

// create mongo model class

mongoose.model("users", userSchemaGoogle);
