require("dotenv").config();
const mongoose = require("mongoose");
const Movie = require("../models/movie");

const movies = [
  // Modern Classics
  {
    title: "Inception",
    releaseYear: 2010,
    posterUrl: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
    description: "A thief steals secrets through dream-sharing technology."
  },
  {
    title: "Interstellar",
    releaseYear: 2014,
    posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    description: "Explorers travel through a wormhole to save humanity."
  },
  {
    title: "The Dark Knight",
    releaseYear: 2008,
    posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    description: "Batman faces the Joker in a battle for Gotham’s soul."
  },
  {
    title: "Whiplash",
    releaseYear: 2014,
    posterUrl: "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
    description: "A young drummer faces a ruthless music instructor."
  },
  {
    title: "Parasite",
    releaseYear: 2019,
    posterUrl: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    description: "A poor family infiltrates a wealthy household."
  },

  // Indie / Auteur
  {
    title: "Her",
    releaseYear: 2013,
    posterUrl: "https://image.tmdb.org/t/p/w500/eCOtqtfvn7mxGl6nfmq4b1exJRc.jpg",
    description: "A man falls in love with an AI operating system."
  },
  {
    title: "Moonlight",
    releaseYear: 2016,
    posterUrl: "https://image.tmdb.org/t/p/w500/A0Idj4xG5h8g0jH3kC2h1RkXcT1.jpg",
    description: "A young man grapples with identity and connection."
  },
  {
    title: "Lady Bird",
    releaseYear: 2017,
    posterUrl: "https://image.tmdb.org/t/p/w500/gl66K7zRdtNYGrxyS2YDUP5ASZd.jpg",
    description: "A coming-of-age story set in Sacramento."
  },
  {
    title: "Before Sunrise",
    releaseYear: 1995,
    posterUrl: "https://image.tmdb.org/t/p/w500/4Q6wPqz4rHf5yKdPn9mJzqF4F6K.jpg",
    description: "Two strangers spend one night together in Vienna."
  },

  // International Cinema
  {
    title: "Spirited Away",
    releaseYear: 2001,
    posterUrl: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    description: "A girl enters a mysterious spirit world."
  },
  {
    title: "Oldboy",
    releaseYear: 2003,
    posterUrl: "https://image.tmdb.org/t/p/w500/pWDtjs568ZfOTMbURQBYuT4QnI3.jpg",
    description: "A man seeks revenge after years of captivity."
  },
  {
    title: "Roma",
    releaseYear: 2018,
    posterUrl: "https://image.tmdb.org/t/p/w500/dtIIyQyALk57ko5bjac7hi01YQ.jpg",
    description: "A year in the life of a domestic worker in Mexico."
  },

  // Popular / Crowd
  {
    title: "Fight Club",
    releaseYear: 1999,
    posterUrl: "https://image.tmdb.org/t/p/w500/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg",
    description: "An insomniac forms an underground fight club."
  },
  {
    title: "Forrest Gump",
    releaseYear: 1994,
    posterUrl: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    description: "The life journey of a kind-hearted man."
  },
  {
    title: "The Matrix",
    releaseYear: 1999,
    posterUrl: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    description: "A hacker discovers the truth about reality."
  },

  // Sci-Fi / New Age
  {
    title: "Arrival",
    releaseYear: 2016,
    posterUrl: "https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg",
    description: "A linguist communicates with extraterrestrial visitors."
  },
  {
    title: "Ex Machina",
    releaseYear: 2014,
    posterUrl: "https://image.tmdb.org/t/p/w500/btbRB7BrD887j5NrvjxceRDmaot.jpg",
    description: "A programmer tests an AI with human traits."
  },

  // Indian Cinema (important)
  {
    title: "Andhadhun",
    releaseYear: 2018,
    posterUrl: "https://image.tmdb.org/t/p/w500/2H7kNShT0oDg0J4e9Yl7pZ2E1V0.jpg",
    description: "A blind pianist gets entangled in a crime."
  },
  {
    title: "Lunchbox",
    releaseYear: 2013,
    posterUrl: "https://image.tmdb.org/t/p/w500/9rqZ3F1fXrF75PwQyQp2gC5W0hY.jpg",
    description: "A mistaken lunchbox delivery sparks a relationship."
  },
  {
    title: "Gangs of Wasseypur",
    releaseYear: 2012,
    posterUrl: "https://image.tmdb.org/t/p/w500/l9E7M1aT5Pp4Xn1D7jF0mE7bP5y.jpg",
    description: "A multi-generational crime saga in India."
  },

  // Extra depth for pagination
  {
    title: "The Social Network",
    releaseYear: 2010,
    posterUrl: "https://image.tmdb.org/t/p/w500/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg",
    description: "The founding of Facebook."
  },
  {
    title: "No Country for Old Men",
    releaseYear: 2007,
    posterUrl: "https://image.tmdb.org/t/p/w500/6d5XOczc226jECq0LIX0siKtgHR.jpg",
    description: "A hunter stumbles upon a drug deal gone wrong."
  },
  {
    title: "Se7en",
    releaseYear: 1995,
    posterUrl: "https://image.tmdb.org/t/p/w500/6yoghtyTpznpBik8EngEmJskVUO.jpg",
    description: "Two detectives hunt a serial killer."
  },
  {
    title: "Blade Runner 2049",
    releaseYear: 2017,
    posterUrl: "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
    description: "A new blade runner uncovers a long-buried secret."
  }
];

async function seedMovies() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    for (const movie of movies) {
      const exists = await Movie.findOne({ title: movie.title });
      if (exists) {
        console.log(`⏭️  Skipped: ${movie.title}`);
        continue;
      }

      await Movie.create(movie);
      console.log(`🎬 Inserted: ${movie.title}`);
    }

    console.log("✨ Movie seeding complete");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seedMovies();
