const mongoose = require("mongoose");
const { Schema } = mongoose;

const placesToSeePostSchema = new Schema(
  {
    postId: {
      type: String,
    },
    title: {
      type: String,
    },
    category: {
      type: String,
    },
    desc: {
      type: String,
    },
    location: {
      type: String,
    },
    completed: {
      type: Boolean,
    },
    date: {
      type: String,
    },
    memo: {
      type: String,
    },
    // creating a relationship to a particular user -- the survey belongs to the user
    // _ the underscore means a reference field
    _user: {
      type: Schema.Types.ObjectId, // the id of the particular use owns this
      // ref: "User",
      ref: "users",
    },
  },
  // the timestamps will automatically have created_at and updated_at fields
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("placesToSeePost", placesToSeePostSchema);
