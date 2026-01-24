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
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Edit Rejected Review</h1>

      <p className="text-sm text-red-500">
        Only rejected reviews can be edited
      </p>

      {rejectedreason && (
        <div className="border border-red-400 bg-red-50 p-3 text-sm">
          <strong>Editor feedback:</strong> {rejectedreason}
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <form onSubmit={handleResubmit} className="space-y-4">
        <input
          type="number"
          min="1"
          max="10"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <textarea
          rows="6"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <button className="w-full bg-black text-white py-2 rounded">
          Resubmit for Review
        </button>
      </form>
    </div>
  );
}

export default EditReview;
