const mongoose=require("mongoose");

const reviewSchema = mongoose.Schema({
  content: {
    type: String,
    required: function () {
      return this.status !== "draft"; //These fields are required only when the review is no longer a draft
    },
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: function () {
      return this.status !== "draft";
    },
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
    enum: ["draft", "in-review", "published", "archived", "rejected"],
    default: "draft",
  },
  rejectedreason: String,
  rejectedby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  views: { type: Number, default: 0 },
  posterUrl: String,
}, { timestamps: true });


const Review=mongoose.model("Review", reviewSchema);

module.exports=Review;