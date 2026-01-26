import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

function ReviewCard({ review, children }) {
  if (!review) return null;

  const {
    _id,
    movie,
    author,
    rating,
    views = 0,
    status,
  } = review;

  if (!movie) return null; 

  const poster = review.posterUrl || review.movie.posterUrl;


  return (
      <div className=" group relative
        rounded-lg
        px-2
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-[0_0_35px_rgba(142,255,1,0.35)]">
        <Link to={`/review/${_id}`} className="block">
        <div className="relative
            w-full
            aspect-[2/3]
            overflow-hidden
            rounded-md
            bg-black/40
">
          {poster ? (
            <img
              src={poster}
              alt={movie.title}
              className="h-full w-full object-cover
                transition-transform duration-500
                group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-textMuted text-sm">
              No poster yet
            </div>
          )}
        </div>
        </Link>

        <div className="mt-3 py-2 space-y-1">
          <div className="flex items-start justify-between gap-2 rounded-md">
            <Link to={`/review/${_id}`} className="block">
            <h3 className="font-serif text-base font-semibold leading-snug ">
              {movie.title}
            </h3>
            </Link>
            <p className="text-sm text-zinc-400">
              by {author?.name || "You"}
            </p>
          </div>
          <StatusBadge status={status} />
        </div>

        <div className="flex justify-between text-sm mt-2 text-textMuted">
          <span>⭐ {rating} / 10</span>
          <span>👁 {(views ?? 0).toLocaleString()}</span>
        </div>

        {children}
      </div>
  );
}

export default ReviewCard;
