import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function ReviewDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReview() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/review/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
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
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="text-xs tracking-widest text-zinc-400 hover:text-zinc-200 transition"
      >
        ← BACK
      </button>

      {/* HERO */}
      <div className="relative h-[300px] md:h-[360px] rounded-xl overflow-hidden">
        {poster && (
          <img
            src={poster}
            alt={review.movie.title}
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-xs opacity-70"
          />
        )}

        <div className="relative h-full p-8 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/60 to-transparent">
          <h1 className="text-2xl md:text-4xl font-serif font-bold text-zinc-100 tracking-wide">
            {review.movie.title}
          </h1>

          <p className="mt-1 text-sm text-zinc-400 font-serif">
            by {review.author?.name}
          </p>

          <div className="flex gap-6 text-xs text-zinc-300 mt-6">
            <span>𓇼 {review.rating} / 10</span>
            <span>👁 {review.views} views</span>
            <span className="capitalize tracking-wide">{review.status}</span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 p-10">
        <p className="text-zinc-200 leading-relaxed whitespace-pre-line font-serif">
          {review.content}
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-4 pt-4">
        {role === "critic" && review.status === "draft" && (
          <button className="px-5 py-2 text-xs tracking-widest rounded-full border border-white/20 text-zinc-200 hover:bg-white/10 transition">
            SUBMIT FOR REVIEW
          </button>
        )}

        {role === "critic" && review.status === "rejected" && (
          <button className="px-5 py-2 text-xs tracking-widest rounded-full border border-white/20 text-zinc-200 hover:bg-white/10 transition">
            RESUBMIT
          </button>
        )}

        {role === "editor" && review.status === "in-review" && (
          <>
            <button className="px-5 py-2 text-xs tracking-widest rounded-full border border-white/30 text-zinc-100 hover:bg-white/15 transition">
              APPROVE
            </button>
            <button className="px-5 py-2 text-xs tracking-widest rounded-full border border-white/15 text-zinc-300 hover:bg-white/5 transition">
              REJECT
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ReviewDetail;
