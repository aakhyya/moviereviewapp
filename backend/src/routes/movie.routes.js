const express = require("express");
const router = express.Router();

const requireAuth = require("../middlewares/requireAuth");
const requireRole = require("../middlewares/requireRole");

const {
  createMovie,
  getAllMovies,
  getMovieById
} = require("../controllers/movie.controllers");

const {
  avgRatingPerMovie
}=require("../controllers/analytics.controllers")

// editor only
router.post("/", requireAuth, requireRole("editor"), createMovie);

// anyone
router.get("/", getAllMovies);
router.get("/:id", getMovieById);
router.get("/:movieId/stats", avgRatingPerMovie);

module.exports = router;