import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ReviewDetail() {
  const { id } = useParams();

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReview() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/review/${id}`
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data?.error);

        setReview(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchReview();
  }, [id]);

  if (loading) {
    return <p className="text-zinc-400 text-sm">Loading review…</p>;
  }

  if (!review || !review.movie) {
    return <p className="text-zinc-400 text-sm">Review not found</p>;
  }

  const poster = review.posterUrl || review.movie.posterUrl;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* HERO */}
      <div className="relative h-[320px] rounded-xl overflow-hidden">
        {poster && (
          <img
            src={poster}
            alt={review.movie.title}
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-xs opacity-70"
          />
        )}

        <div className="relative h-full p-8 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/60 to-transparent">
          <h1 className="text-3xl font-serif font-bold text-zinc-100">
            {review.movie.title}
          </h1>

          <p className="text-sm text-zinc-400">
            by {review.author?.name}
          </p>

          <div className="flex gap-6 text-xs text-zinc-300 mt-4">
            <span>𓇼 {review.rating} / 10</span>
            <span>👁 {review.views}</span>
            <span className="capitalize">{review.status}</span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 p-10">
        <p className="text-zinc-200 whitespace-pre-line font-serif">
          {review.content}
        </p>
      </div>
    </div>
  );
}

export default ReviewDetail;
