const mongoose = require("mongoose");
const { Schema } = mongoose;

const recipientSchema = new Schema(
  {
    email: {
      type: String,
    },
    responded: {
      type: Boolean,
      default: false,
    },
  },
  // the timestamps will automatically have created_at and updated_at fields
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("recipient", recipientSchema);
