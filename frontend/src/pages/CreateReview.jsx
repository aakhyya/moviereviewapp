import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function CreateReview() {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [reviewId, setReviewId] = useState(null); // 👈 important
  const [rating, setRating] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState("idle");
  const [error, setError] = useState("");

  // 🔹 Fetch movie
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
      }
    }

    fetchMovie();
  }, [movieId]);

  // 🔹 Fetch existing draft (if any)
  useEffect(() => {
    async function fetchDraft() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/review/draft/${movieId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!res.ok) return;

        const draft = await res.json();

        setReviewId(draft._id);
        setRating(draft.rating || "");
        setContent(draft.content || "");
        setPosterUrl(draft.posterUrl || "");
        setStatus(draft.status);
      }
       catch(err) {
        console.log("Something went wrong",err);
       }
      finally {
        setLoading(false);
      }
    }

    fetchDraft();
  }, [movieId]);

  // 🔑 AUTOSAVE (draft only)
  useEffect(() => {
    if (!reviewId) return;
    if (status !== "draft") return;
    if (!content && !rating) return;

    setAutosaveStatus("saving");

    const timeout = setTimeout(async () => {
      try {
        await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/review/${reviewId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ rating, content, posterUrl }),
          }
        );

        setAutosaveStatus("saved");
        setTimeout(() => setAutosaveStatus("idle"), 2000);
      } catch {
        setAutosaveStatus("error");
      }
    }, 1200);

    return () => clearTimeout(timeout);
  }, [rating, content, posterUrl, reviewId, status]);

  // 🔹 Submit for review
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSubmitting(true);

      await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/review/${reviewId}/submit`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      navigate("/critic/reviews");
    } catch {
      setError("Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !movie) {
    return <p className="text-center text-zinc-500">Loading…</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">
        Write a Review for {movie.title}
      </h1>

      {/* Autosave indicator */}
      <p className="text-xs text-zinc-500">
        {autosaveStatus === "saving" && "Saving draft…"}
        {autosaveStatus === "saved" && "Draft saved"}
        {autosaveStatus === "error" && "Autosave failed"}
      </p>

      {error && <p className="text-sm text-red-500">{error}</p>}

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

        <input
          type="url"
          value={posterUrl}
          onChange={(e) => setPosterUrl(e.target.value)}
          placeholder="Poster URL (optional)"
          className="w-full border rounded px-3 py-2"
        />

        <textarea
          rows="6"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Write your review…"
        />

        <button
          disabled={submitting}
          className="w-full bg-black text-white py-2 rounded"
        >
          Submit for Review
        </button>
      </form>
    </div>
  );
}

export default CreateReview;
