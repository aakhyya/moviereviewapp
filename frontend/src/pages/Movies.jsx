import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Movies() {
  const [movies, setMovies] = useState([]);
  const [statsByMovie, setStatsByMovie] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { role } = useAuth();

  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/movie`);
        const data = await res.json();
        setMovies(data);
      }
      catch (err) {
        console.error("Failed to fetch movies", err);
      }
      finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, []);

  useEffect(() => {
    if (!movies.length) return;

    async function fetchStats() {
      const results = await Promise.all( //all stats are fetched at once, no waterfall delay
        movies.map(movie =>
          fetch(`${import.meta.env.VITE_API_BASE_URL}/movie/${movie._id}/stats`)
            .then(res => res.json())
            .then(stats => ({ movieId: movie._id, stats })) // mapping movie to their respective 
          // stats using movie._id
        )
      );

      const statsMap = {};
      results.forEach(({ movieId, stats }) => { //O(1) access by movieId, could scale 100s of movies
        statsMap[movieId] = stats;
      });

      setStatsByMovie(statsMap);
    }

    fetchStats();
  }, [movies]);


  if (loading) {
    return <p className="p-6 text-zinc-500">Loading movies...</p>;
  }

  // flex → puts children on the same row
  // justify-between → pushes first item left, second item right
  // items-center → vertical alignment perfection
  return (
  <div className="max-w-6xl mx-auto px-6 py-10">
    {/* HEADER ROW */}
    <div className="flex items-center justify-between mb-8">
      <h1 className="relative z-10
      text-xl md:text-2xl
      font-serif
      tracking-[0.2em]
      text-zinc-100">
        MOVIES
      </h1>

      {role === "editor" && (
        <button
          onClick={() => navigate("/editor/movies/new")}
          className="
            text-xs
            tracking-widest
            uppercase
            px-4 py-2
            rounded-full
            border border-white/30
            text-zinc-200
            hover:bg-white/10
            transition
          "
        >
          + Add Movie
        </button>
      )}
    </div>

    {/* MOVIE GRID */}
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
      {movies.map(movie => (
        <div
          key={movie._id}
          className="
            group
            rounded-xl
            overflow-hidden
            bg-black/30
            backdrop-blur-md
            border border-white/10
            transition
            hover:-translate-y-1
            hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)]
          "
        >
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="
              w-full
              aspect-[2/3]
              object-cover
              transition-transform duration-500
              group-hover:scale-[1.04]
            "
          />

          <div className="p-4 flex flex-col h-[130px]">
            <div className="space-y-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-serif font-semibold text-zinc-100">
                  {movie.title}
                </h3>

                {role === "critic" && (
                  <button
                    onClick={() => navigate(`/movies/${movie._id}/review`)}
                    className="
                      text-[10px]
                      uppercase
                      px-2 py-1
                      rounded-full
                      border border-white/25
                      hover:bg-white/10
                    "
                  >
                    Write
                  </button>
                )}
              </div>

              <p className="text-xs text-zinc-400">
                {movie.releaseYear}
              </p>
            </div>

            <p className="mt-auto text-xs text-zinc-300">
              𓇼{" "}
              {statsByMovie[movie._id]
                ? statsByMovie[movie._id].avgRating.toFixed(1)
                : "—"}
              <span className="ml-1 text-zinc-500">
                ({statsByMovie[movie._id]?.totalReviews || 0})
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
    
}

export default Movies;