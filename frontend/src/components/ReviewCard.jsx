import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

function ReviewCard({ review, children }) {
  if (!review) return null; // 🛑 guard

  const {
    _id,
    movietitle,
    author,
    rating,
    views = 0,
    status,
    posterUrl,
  } = review;

  return (
      <div className="bg-velvet/90 text-ivory rounded-xl p-5 space-y-3 hover:-translate-y-1 transition">
        <Link to={`/review/${_id}`} className="block">
        <div className="w-full rounded-md bg-zinc-800 overflow-hidden aspect-[2/3] flex items-center justify-center text-zinc-500 text-sm">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movietitle}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            "No poster yet"
          )}
        </div>
        </Link>

        <div className="flex justify-between items-start">
          <div className="font-serif min-h-[76px]">
            <Link to={`/review/${_id}`} className="block">
            <h3 className="text-base sm:text-lg font-semibold line-clamp-2">
              {movietitle}
            </h3>
            </Link>
            <p className="text-sm text-zinc-400">
              by {author?.name || "You"}
            </p>
          </div>
          <StatusBadge status={status} />
        </div>

        <div className="flex justify-between text-sm pt-2">
          <span>⭐ {rating} / 10</span>
          <span>👁 {(views ?? 0).toLocaleString()}</span>
        </div>

        {children}
      </div>
  );
}

export default ReviewCard;
