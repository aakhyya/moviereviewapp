const Review = require("../models/review");
const Audit = require("../models/auditlog");
const Movie = require("../models/movie");

/* =========================
   CRITIC
========================= */

// 1. Create + submit review directly (NO drafts)
async function createReview(req, res) {
  const { content, rating, posterUrl } = req.body;
  const { movieId } = req.params;

  if (!content || !rating) {
    return res.status(400).json({ error: "Rating and content are required" });
  }

  const movie = await Movie.findById(movieId);
  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }

  const review = await Review.create({
    movie: movieId,
    content,
    rating,
    posterUrl,
    author: req.user.id,
    status: "in-review",
  });

  await Audit.create({
    actor: req.user.id,
    action: "REVIEW_SUBMITTED",
    entityType: "Review",
    entityId: review._id,
  });

  res.status(201).json(review);
}

// 2. Get critic’s reviews
async function getMyReviews(req, res) {
  const reviews = await Review.find({
    author: req.user.id,
  })
    .populate("author", "name")
    .populate("movie")
    .sort({ createdAt: -1 });

  res.json(reviews);
}

// 3. Get rejected reviews (optional helper)
async function getRejectedreviews(req, res) {
  const reviews = await Review.find({
    author: req.user.id,
    status: "rejected",
  })
    .populate("movie")
    .populate("rejectedby", "name");

  res.json(reviews);
}

// 4. Get rejected review for edit
async function getReviewForEdit(req, res) {
  const review = await Review.findById(req.params.id).populate("movie");

  if (!review) {
    return res.status(404).json({ error: "Review not found" });
  }

  if (review.author.toString() !== req.user.id) {
    return res.status(403).json({ error: "Access denied" });
  }

  if (review.status !== "rejected") {
    return res.status(400).json({
      error: "Only rejected reviews can be edited",
    });
  }

  res.json(review);
}

// 5. Update rejected review (content + rating)
async function updateReview(req, res) {
  const { rating, content, posterUrl } = req.body;

  if (!rating || !content) {
    return res.status(400).json({
      error: "Rating and content are required",
    });
  }

  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ error: "Review not found" });
  }

  if (review.author.toString() !== req.user.id) {
    return res.status(403).json({ error: "Access denied" });
  }

  if (review.status !== "rejected") {
    return res.status(400).json({
      error: "Only rejected reviews can be edited",
    });
  }

  review.rating = rating;
  review.content = content;
  if (posterUrl !== undefined) review.posterUrl = posterUrl;

  await review.save();

  await Audit.create({
    actor: req.user.id,
    action: "REVIEW_UPDATED",
    entityType: "Review",
    entityId: review._id,
  });

  res.json({ message: "Review updated" });
}

// 6. Resubmit rejected review
async function resubmitReview(req, res) {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({ error: "Review not found" });
  }

  if (review.author.toString() !== req.user.id) {
    return res.status(403).json({ error: "Access denied" });
  }

  if (review.status !== "rejected") {
    return res.status(400).json({
      error: "Only rejected reviews can be resubmitted",
    });
  }

  review.status = "in-review";
  review.rejectedreason = undefined;
  review.rejectedby = undefined;

  await review.save();

  await Audit.create({
    actor: req.user.id,
    action: "REVIEW_RESUBMITTED",
    entityType: "Review",
    entityId: review._id,
  });

  res.json({ message: "Review resubmitted for review" });
}

/* =========================
   EDITOR
========================= */

async function getInReviews(req, res) {
  const reviews = await Review.find({ status: "in-review" })
    .populate("author", "name")
    .populate("movie");

  res.json(reviews);
}

async function approveReview(req, res) {
  const review = await Review.findById(req.params.id);

  if (!review || review.status !== "in-review") {
    return res.status(400).json({ error: "Invalid review" });
  }

  review.status = "published";
  review.rejectedreason = undefined;
  review.rejectedby = undefined;

  await review.save();

  await Audit.create({
    actor: req.user.id,
    action: "REVIEW_APPROVED",
    entityType: "Review",
    entityId: review._id,
  });

  res.json({ message: "Review published" });
}

async function rejectReview(req, res) {
  const { reason } = req.body;

  if (!reason) {
    return res.status(400).json({ error: "Rejection reason required" });
  }

  const review = await Review.findById(req.params.id);
  if (!review || review.status !== "in-review") {
    return res.status(400).json({ error: "Invalid review" });
  }

  review.status = "rejected";
  review.rejectedreason = reason;
  review.rejectedby = req.user.id;

  await review.save();

  await Audit.create({
    actor: req.user.id,
    action: "REVIEW_REJECTED",
    entityType: "Review",
    entityId: review._id,
    metadata: { reason },
  });

  res.json({ message: "Review rejected" });
}

/* =========================
   VIEWERS
========================= */

async function getPublishedReviews(req, res) {
  const reviews = await Review.find({ status: "published" })
    .populate("author", "name")
    .populate("movie");

  res.json(reviews);
}

async function getReviewbyId(req, res) {
  const review = await Review.findOne({
    _id: req.params.id,
    status: "published",
  })
    .populate("author", "name")
    .populate("movie");

  if (!review) {
    return res.status(404).json({ error: "Review not found" });
  }

  review.views += 1;
  await review.save();

  res.json(review);
}

module.exports = {
  createReview,
  getMyReviews,
  getRejectedreviews,
  getReviewForEdit,
  updateReview,
  resubmitReview,
  getInReviews,
  approveReview,
  rejectReview,
  getPublishedReviews,
  getReviewbyId,
};
