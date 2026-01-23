const express = require("express");
const router = express.Router();

const requireAuth = require("../middlewares/requireAuth");
const requireRole = require("../middlewares/requireRole");

const {
  createMovie,
  getAllMovies,
  getMovieById,
  getMovieBySlug
} = require("../controllers/movie.controllers");

// editor only
router.post("/", requireAuth, requireRole("editor"), createMovie);

// anyone
router.get("/", getAllMovies);
router.get("/:id", getMovieById);
router.get("/slug/:slug", getMovieBySlug);

module.exports = router;