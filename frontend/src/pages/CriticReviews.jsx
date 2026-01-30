import { useEffect, useState } from "react";
import ReviewCard from "../components/ReviewCard";

function CriticReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    }

    fetchMyReviews();
  }, []);

  if (loading) {
    return <p className="text-zinc-500">Loading your reviews…</p>;
  }

  if (!reviews.length) {
    return <p className="text-zinc-500">No reviews yet.</p>;
  }

  const inReview = reviews.filter(r => r.status === "in-review");
  const rejected = reviews.filter(r => r.status === "rejected");
  const published = reviews.filter(r => r.status === "published");

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-14">
      <h1 className="text-xl font-serif tracking-widest text-zinc-200">
        My Reviews
      </h1>

      <Section title="In Review" reviews={inReview} />
      <Section title="Rejected" reviews={rejected} />
      <Section title="Published" reviews={published} />
    </div>
  );
}

function Section({ title, reviews }) {
  if (!reviews.length) return null;

  return (
    <section>
      <h2 className="text-sm tracking-widest text-zinc-400 mb-6">
        {title.toUpperCase()}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {reviews.map(review => (
          <ReviewCard key={review._id} review={review} />
        ))}
      </div>
    </section>
  );
}

export default CriticReviews;
