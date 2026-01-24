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
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex gap-6">
        <img
          src={poster}
          alt={review.movie.title}
          className="w-40 aspect-[2/3] object-cover rounded-lg"
        />

        <div>
          <h1 className="text-2xl font-serif font-semibold">
            {review.movie.title}
          </h1>
          <p className="text-sm text-zinc-500">
            by {review.author?.name}
          </p>
          <p className="mt-2">⭐ {review.rating} / 10</p>
          <p className="mt-1 text-sm text-amber-600">
            Status: {review.status}
          </p>
        </div>
      </div>

      {/* Review Content */}
      <div className="bg-white rounded-lg p-4 shadow">
        <p className="whitespace-pre-wrap">{review.content}</p>
      </div>

      {/* Actions */}
      {review.status === "in-review" && (
        <div className="flex gap-4">
          <button
            onClick={handleApprove}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Approve
          </button>

          <button
            onClick={handleReject}
            className="bg-red-600 text-white px-6 py-2 rounded"
          >
            Reject
          </button>
        </div>
      )}

      {/* Reject reason input */}
      {review.status === "in-review" && (
        <textarea
          rows="3"
          placeholder="Rejection reason (required)"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      )}
    </div>
  );
}

export default EditorReviewDetail;
