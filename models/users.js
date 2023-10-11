const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ["customer", "author", "admin"],
      default: "customer",
    },
  },
  { timestamps: true }
);

exports.userSchema = mongoose.model("users", userSchema);
