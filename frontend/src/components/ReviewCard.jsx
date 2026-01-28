import { Link, useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";

function ReviewCard({ review, children }) {
  const navigate=useNavigate();
  if (!review) return null;

  const {
    _id,
    movie,
    rating,
    views = 0,
    status,
  } = review;

  const movieTitle = movie?.title || review.movietitle || "Untitled Draft";
  const poster = review.posterUrl || movie?.posterUrl;
  

  return (
    <div
      className="
        group relative
        rounded-lg
        px-2 pb-3
        transition-all duration-300
        bg-black/20
        hover:-translate-y-1
        hover:shadow-[0_0_30px_rgba(255,255,255,0.18)]
      "
    >
      {/* Poster */}
      <Link to={`/review/${_id}`} className="block">
        <div
          className="
            relative
            w-full
            aspect-[2/3]
            overflow-hidden
            rounded-md
            bg-black/50
          "
        >
          {poster ? (
            <img
              src={poster}
              alt={movieTitle}
              className="
                h-full w-full object-cover
                transition-transform duration-500
                group-hover:scale-[1.04]
              "
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-500 text-sm">
              No poster yet
            </div>
          )}

          {/* Soft vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
      </Link>

      {/* Content */}
      <div className="mt-3 py-2 space-y-1">
        <div className="flex items-start justify-between gap-2">
  <Link to={`/review/${_id}`} className="block">
    <h3 className="font-serif text-base font-semibold leading-snug text-zinc-100">
  {movieTitle}
</h3>
  </Link>

  {status === "rejected" && (
    <button
      onClick={() => navigate(`/critic/review/edit/${_id}`)}
      className="
        text-[10px]
        tracking-widest
        uppercase
        px-2 py-1
        rounded-full
        border border-white/25
        text-zinc-200
        hover:bg-white/10
        transition
        shrink-0
      "
    >
      Resubmit
    </button>
  )}
</div>


        <StatusBadge status={status} />
      </div>

      {/* Meta */}
      <div className="flex justify-between text-xs mt-2 text-zinc-400">
        <span>𓇼 {rating} / 10</span>
        <span>👁 {(views ?? 0).toLocaleString()}</span>
      </div>

      {children}
    </div>
  );
}

export default ReviewCard;
