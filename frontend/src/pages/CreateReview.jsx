import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function CreateReview() {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMovie() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/movie/${movieId}`
        );
        const data = await res.json();
        setMovie(data);
      } catch {
        setError("Failed to load movie");
      } finally {
        setLoading(false);
      }
    }

    fetchMovie();
  }, [movieId]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/review/movie/${movieId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ rating, content, posterUrl }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error || "Submission failed");
      }

      navigate("/critic/reviews");
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading || !movie) {
    return <p className="text-center text-zinc-500">Loading…</p>;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
      <h1 className="text-2xl font-serif text-center text-zinc-100">
        {movie.title}
      </h1>

      {error && (
        <p className="text-xs text-center text-red-400">{error}</p>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl p-10 space-y-6 backdrop-blur-xl bg-white/10 border border-white/20"
      >
        <input
          type="number"
          min="1"
          max="10"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          placeholder="Rating (1–10)"
          className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-2 text-zinc-100"
        />

        <input
          type="url"
          value={posterUrl}
          onChange={(e) => setPosterUrl(e.target.value)}
          placeholder="Poster URL (optional)"
          className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-2 text-zinc-100"
        />

        <textarea
          rows="8"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your thoughts…"
          className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-zinc-100 resize-none"
        />

        <button
          disabled={!rating || !content}
          className="w-full py-3 rounded-full border border-white/30 text-zinc-100 uppercase tracking-widest hover:bg-white/10 disabled:opacity-50"
        >
          Submit for Review
        </button>
      </form>
    </div>
  );
}

export default CreateReview;
