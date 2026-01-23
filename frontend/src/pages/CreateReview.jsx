import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function CreateReview() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 1️⃣ Fetch movie by slug
  useEffect(() => {
    async function fetchMovie() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/movie/slug/${slug}`
        );
        const data = await res.json();

        if (!res.ok) {
          setError(data?.error || "Movie not found");
          return;
        }

        setMovie(data);
      } catch {
        setError("Failed to load movie");
      }
    }

    fetchMovie();
  }, [slug]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!rating || !content) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      // 2️⃣ Create draft review using movie._id
      const createRes = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/review/${movie._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ rating, content }),
        }
      );

      const createdReview = await createRes.json();

      if (!createRes.ok) {
        setError(createdReview?.error || "Failed to create review");
        return;
      }

      // 3️⃣ Submit for review
      await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/review/${createdReview._id}/submit`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      navigate("/critic/reviews");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if(loading){
    return <p className="text-center text-zinc-500">Loading movie…</p>;
  }

  if (!movie) {
    return <p className="text-center text-zinc-500">No movie found</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Write a Review for {movie.title}
      </h1>

      {error && <p className="mb-3 text-red-500 text-sm">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          min="1"
          max="10"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Rating (1–10)"
        />

        <textarea
          rows="6"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Write your review…"
        />

        <button
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Submitting…" : "Submit for Review"}
        </button>
      </form>
    </div>
  );
}

export default CreateReview;
