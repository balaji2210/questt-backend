const mongoose = require("mongoose");

const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    count: {
      type: Number,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "books",
      required: true,
    },
    image: String,
  },
  { timestamps: true }
);

exports.orderSchema = mongoose.model("orders", orderSchema);
