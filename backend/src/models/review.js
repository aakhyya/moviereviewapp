const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 10,
      required: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["in-review", "published", "archived", "rejected"],
      default: "in-review",
    },
    rejectedreason: String,
    rejectedby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    views: {
      type: Number,
      default: 0,
    },
    posterUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
