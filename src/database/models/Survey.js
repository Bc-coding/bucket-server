const mongoose = require("mongoose");
const { Schema } = mongoose;
// import RecipientSchema to make a subdocument
const recipientSchema = require("./Recipient");

const surveySchema = new Schema(
  {
    title: {
      type: String,
    },
    body: {
      type: String,
    },
    subject: {
      type: String,
    },
    recipients: {
      type: [recipientSchema.schema],
    },
    yes: {
      type: Number,
      default: 0,
    },
    no: {
      type: Number,
      default: 0,
    },
    // creating a relationship to a particular user -- the survey belongs to the user
    // _ the underscore means a reference field
    _user: {
      type: Schema.Types.ObjectId, // the id of the particular use owns this
      ref: "User",
    },
    dateSent: Date,
    lastResponded: Date,
  },
  // the timestamps will automatically have created_at and updated_at fields
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("surveys", surveySchema);
