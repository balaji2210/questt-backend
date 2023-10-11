const mongoose = require("mongoose");

const { Schema } = mongoose;

const booksSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
    image: {
      public_id: String,
      url: String,
    },
    averageRating: {
      type: Number,
      default: null,
    },
    publication: {
      type: Date,
      default: Date.now(),
    },
    publisher: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

exports.booksSchema = mongoose.model("books", booksSchema);
