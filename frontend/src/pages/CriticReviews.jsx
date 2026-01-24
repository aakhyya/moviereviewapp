import { useEffect, useState } from "react";
import ReviewCard from "../components/ReviewCard";
import { useNavigate } from "react-router-dom";

function CriticReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMyReviews() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/review/mine`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error("Failed to fetch critic reviews", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMyReviews();
  }, []);

  async function submitReview(id) {
    if (!confirm("Submit this review for editor approval?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/review/${id}/submit`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) throw new Error("Submit failed");

      // optimistic update
      setReviews(prev =>
        prev.map(r =>
          r._id === id ? { ...r, status: "in-review" } : r)
      );
    } catch (err) {
      alert("Could not submit review",err);
    }
  }

  if (loading) {
    return <p className="text-zinc-500">Loading your reviews…</p>;
  }

  if (reviews.length === 0) {
    return <p className="text-zinc-500">You haven’t written any reviews yet.</p>;
  }

  // Group reviews
  const drafts = reviews.filter(r => r.status === "draft");
  const inReview = reviews.filter(r => r.status === "in-review");
  const rejected = reviews.filter(r => r.status === "rejected");
  const published = reviews.filter(r => r.status === "published");

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-12">
      <h1 className="text-2xl font-semibold">My Reviews</h1>

      {/* Drafts */}
      <Section
        title="Drafts"
        reviews={drafts}
        renderExtra={(review) => (
          <div className="flex gap-4 mt-2">
            <button
              onClick={() => navigate(`/critic/review/edit/${review._id}`)}
              className="text-sm underline"
            >
              Edit
            </button>

            <button
              onClick={() => submitReview(review._id)}
              className="text-sm text-green-500 underline"
            >
              Submit for review
            </button>
          </div>
        )}
      />

      {/* In Review */}
      <Section
        title="In Review"
        reviews={inReview}
        renderExtra={() => (
          <p className="text-xs text-zinc-400 mt-2">
            Awaiting editor decision
          </p>
        )}
      />

      {/* Rejected */}
      <Section
        title="Rejected"
        reviews={rejected}
        renderExtra={(review) => (
          <>
            <p className="text-sm text-red-500 mt-2">
              Reason: {review.rejectedreason}
            </p>
            <button
              onClick={() => navigate(`/critic/review/edit/${review._id}`)}
              className="mt-2 text-sm underline"
            >
              Edit & Resubmit
            </button>
          </>
        )}
      />

      {/* Published */}
      <Section title="Published" reviews={published} />
    </div>
  );
}

function Section({ title, reviews, renderExtra }) {
  if (!reviews.length) return null;

  return (
    <section>
      <h2 className="text-xl font-medium mb-4">{title}</h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review._id} review={review}>
            {renderExtra && renderExtra(review)}
          </ReviewCard>
        ))}
      </div>
    </section>
  );
}

export default CriticReviews;
