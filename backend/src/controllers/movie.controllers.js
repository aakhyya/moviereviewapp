const Movie = require("../models/movie");

// EDITOR: 
//1. add movie
async function createMovie(req, res) {
  const { title, releaseYear, posterUrl, description } = req.body;

  if (!title || !releaseYear || !posterUrl) {
    return res.status(400).json({
      error: "Title, release year and poster are required",
    });
  }

  const exists = await Movie.findOne({ title });
  if (exists) {
    return res.status(400).json({ error: "Movie already exists" });
  }


  const movie = await Movie.create({
    title,
    releaseYear,
    posterUrl,
    description,
    createdBy: req.user.id,
  });

  res.status(201).json(movie);
}

// ANYONE:
//1. list movies
async function getAllMovies(req, res) {
  const movies = await Movie.find().sort({ releaseYear: -1 });
  res.json(movies);
}
//2.single movie
async function getMovieById(req, res) {
  const movie = await Movie.findById(req.params.id);
  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }
  res.json(movie);
}

module.exports = {
  createMovie,
  getAllMovies,
  getMovieById
};