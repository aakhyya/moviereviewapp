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
        if (!draft) {
          setLoading(false);
          return;
        }

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

    let id = reviewId;

    // 🔴 CRITICAL FIX
    if (!id) {
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

      if (!res.ok) throw new Error("Failed to create draft");

      const created = await res.json();
      id = created._id;
      setReviewId(id);
    }

    // ✅ NOW submit
    await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/review/${id}/submit`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    navigate("/critic/reviews");
  } catch (err) {
    setError("Submission failed",err);
  } finally {
    setSubmitting(false);
  }
}


  if (loading || !movie) {
    return <p className="text-center text-zinc-500">Loading…</p>;
  }

  return (
  <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
    {/* Header */}
    <div className="space-y-2 text-center">
      <h1 className="text-2xl font-serif tracking-wide text-zinc-100">
        {movie.title}
      </h1>
    </div>

    {/* Autosave */}
    <p className="text-xs text-zinc-400 tracking-wide">
      {autosaveStatus === "saving" && "Saving draft…"}
      {autosaveStatus === "saved" && "Draft saved"}
      {autosaveStatus === "error" && "Autosave failed"}
    </p>

    {error && (
      <p className="text-xs tracking-wide text-zinc-300">
        {error}
      </p>
    )}

    {/* Glass Form */}
    <form
      onSubmit={handleSubmit}
      className="
        relative
        rounded-2xl
        p-10
        space-y-6
        backdrop-blur-xl
        bg-gradient-to-br
        from-white/10 via-white/5 to-white/10
        border border-white/20
        shadow-[0_20px_60px_rgba(0,0,0,0.6)]
      "
    >
      {/* Rating */}
      <div className="space-y-1">
        <label className="text-xs tracking-widest text-zinc-400 uppercase">
          Rating
        </label>
        <input
          type="number"
          min="1"
          max="10"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          placeholder="1 – 10"
          className="
            w-full
            bg-black/40
            border border-white/20
            rounded-lg
            px-4 py-2
            text-zinc-100
            placeholder-zinc-500
            focus:outline-none
            focus:border-white/40
          "
        />
      </div>

      {/* Poster URL */}
      <div className="space-y-1">
        <label className="text-xs tracking-widest text-zinc-400 uppercase">
          Poster URL (optional)
        </label>
        <input
          type="url"
          value={posterUrl}
          onChange={(e) => setPosterUrl(e.target.value)}
          placeholder="https://…"
          className="
            w-full
            bg-black/40
            border border-white/20
            rounded-lg
            px-4 py-2
            text-zinc-100
            placeholder-zinc-500
            focus:outline-none
            focus:border-white/40
          "
        />
      </div>

      {/* Content */}
      <div className="space-y-1">
        <label className="text-xs tracking-widest text-zinc-400 uppercase">
          Review
        </label>
        <textarea
          rows="8"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your thoughts…"
          className="
            w-full
            bg-black/40
            border border-white/20
            rounded-lg
            px-4 py-3
            text-zinc-100
            placeholder-zinc-500
            focus:outline-none
            focus:border-white/40
            resize-none
          "
        />
      </div>

      {/* Submit */}
      <button
        disabled={!rating || !content || submitting}
        className="
          w-full
          mt-4
          py-3
          rounded-full
          border border-white/30
          text-zinc-100
          tracking-widest
          uppercase
          hover:bg-white/10
          transition
          disabled:opacity-50
        "
      >
        Submit for Review
      </button>
    </form>
  </div>
  );
}

export default CreateReview;
