import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditReview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState("");
  const [content, setContent] = useState("");
  const [rejectedreason, setRejectedreason] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchReview() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/review/${id}/edit`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();

        if (data.status !== "rejected") {
          navigate("/critic/reviews");
          return;
        }

        setRating(data.rating);
        setContent(data.content);
        setRejectedreason(data.rejectedreason || "");
      } catch {
        setError("Failed to load review");
      } finally {
        setLoading(false);
      }
    }

    fetchReview();
  }, [id, navigate]);

  async function handleResubmit(e) {
    e.preventDefault();

    try {
      await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/review/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ rating, content }),
        }
      );

      await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/review/${id}/resubmit`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      navigate("/critic/reviews");
    } catch {
      setError("Resubmission failed");
    }
  }

  if (loading) {
    return <p className="text-zinc-500">Loading review…</p>;
  }

  return (
  <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
    {/* Header */}
    <div className="space-y-2 text-center">
      <h1 className="text-2xl font-serif tracking-wide text-zinc-100">
        Edit Rejected Review
      </h1>
    </div>

    {/* Info note */}
    <p className="text-xs text-zinc-400 tracking-wide text-center">
      Only rejected reviews can be edited
    </p>

    {error && (
      <p className="text-xs tracking-wide text-zinc-300 text-center">
        {error}
      </p>
    )}

    {/* Glass Form */}
    <form
      onSubmit={handleResubmit}
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
        "
      >
        Resubmit for Review
      </button>

      {/* Rejection Reason – placed at bottom */}
      {rejectedreason && (
        <div className="pt-6 border-t border-white/10">
          <p className="text-xs tracking-wide text-zinc-400 uppercase mb-1">
            Editor Feedback
          </p>
          <p className="text-sm text-zinc-300 italic">
            {rejectedreason}
          </p>
        </div>
      )}
    </form>
  </div>
);

}

export default EditReview;
