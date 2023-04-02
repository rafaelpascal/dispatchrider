const mongoose = require("mongoose");

const feedBackSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is Requires"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
      unique: [true, "Email Already Exist"],
    },
    phone: {
      type: String,
      required: [true, "Phone is Requires"],
    },
    subject: {
      type: String,
      required: [true, "message is Requires"],
    },
    message: {
      type: String,
      required: [true, "message is Requires"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedBackSchema)
