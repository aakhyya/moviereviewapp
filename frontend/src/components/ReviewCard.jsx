import { Link, useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";

function ReviewCard({ review }) {
  const navigate = useNavigate();
  if (!review) return null;

  const { _id, movie, rating, views = 0, status } = review;
  const poster = review.posterUrl || movie?.posterUrl;

  return (
    <div className="rounded-lg bg-black/20 p-2 hover:shadow-lg transition">
      <Link to={`/review/${_id}`}>
        <div className="aspect-[2/3] rounded-md overflow-hidden bg-black/40">
          {poster && (
            <img
              src={poster}
              alt={movie?.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </Link>

      <div className="mt-3 space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="font-serif text-zinc-100">{movie?.title}</h3>

          {status === "rejected" && (
            <button
              onClick={() => navigate(`/critic/review/edit/${_id}`)}
              className="text-xs px-2 py-1 rounded-full border border-white/25 text-zinc-200 hover:bg-white/10"
            >
              Edit
            </button>
          )}
        </div>

        <StatusBadge status={status} />

        <div className="flex justify-between text-xs text-zinc-400">
          <span>𓇼 {rating} / 10</span>
          <span>👁 {views}</span>
        </div>
      </div>
    </div>
  );
}

export default ReviewCard;
