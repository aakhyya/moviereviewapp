import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditorReviewDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    async function fetchReview() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/review/editor/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setError(data?.error || "Failed to load review");
          return;
        }

        setReview(data);
      } catch {
        setError("Server error");
      } finally {
        setLoading(false);
      }
    }

    fetchReview();
  }, [id]);

  async function handleApprove() {
    await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/review/${review._id}/approve`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    navigate("/editor");
  }

  async function handleReject() {
    if (!rejectReason.trim()) {
      alert("Rejection reason required");
      return;
    }

    await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/review/${review._id}/reject`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ reason: rejectReason }),
      }
    );

    navigate("/editor");
  }

  if (loading) {
    return <p className="text-center text-zinc-500">Loading review…</p>;
  }

  if (error || !review || !review.movie) {
    return <p className="text-center text-red-500">{error || "Review not found"}</p>;
  }

  const poster = review.posterUrl || review.movie.posterUrl;

  return (
  <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
    {/* Header */}
    <div className="flex gap-8 items-start">
      <img
        src={poster}
        alt={review.movie.title}
        className="
          w-44
          aspect-[2/3]
          object-cover
          rounded-xl
          shadow-[0_10px_40px_rgba(0,0,0,0.6)]
        "
      />

      <div className="space-y-2">
        <h1 className="text-3xl font-serif tracking-wide text-zinc-100">
          {review.movie.title}
        </h1>

        <p className="text-sm text-zinc-400">
          by {review.author?.name}
        </p>

        <div className="flex gap-6 text-sm text-zinc-300 mt-4">
          <span>⭐ {review.rating} / 10</span>
          <span className="capitalize tracking-wide">
            {review.status.replace("-", " ")}
          </span>
        </div>
      </div>
    </div>

    {/* Review Content — Glass */}
    <div
      className="
        relative
        rounded-2xl
        p-10
        backdrop-blur-xl
        bg-gradient-to-br
        from-white/10 via-white/5 to-white/10
        border border-white/20
        shadow-[0_20px_60px_rgba(0,0,0,0.6)]
      "
    >
      <p className="text-zinc-200 leading-relaxed whitespace-pre-line font-serif">
        {review.content}
      </p>
    </div>

    {/* Editor Actions */}
    {review.status === "in-review" && (
      <div className="space-y-4">
        {/* Reject reason */}
        <div className="space-y-1">
          <label className="text-xs tracking-widest text-zinc-400 uppercase">
            Rejection Feedback
          </label>
          <textarea
            rows="3"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Provide feedback for the critic…"
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

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={handleApprove}
            className="
              px-5 py-2
              text-xs
              tracking-widest
              uppercase
              rounded-full
              border border-white/30
              text-zinc-100
              hover:bg-white/15
              transition
            "
          >
            Approve
          </button>

          <button
            onClick={handleReject}
            className="
              px-5 py-2
              text-xs
              tracking-widest
              uppercase
              rounded-full
              border border-white/15
              text-zinc-300
              hover:bg-white/5
              transition
            "
          >
            Reject
          </button>
        </div>
      </div>
    )}
  </div>
);

}

export default EditorReviewDetail;
