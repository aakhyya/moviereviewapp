import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
function ReviewCard({id, title,author,rating,views,status,posterUrl}){
    return(
        <Link to={`/review/${id}`} className="block">
        <div className=" bg-velvet text-ivory rounded-xl hover:shadow-md cursor-pointer p-5 space-y-3 hover:-translate-y-1 transition-transform">
            <div className="w-full rounded-md bg-zinc-800 overflow-hidden aspect-[2/3]">
                <img
                    src={posterUrl}
                    alt={title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                />
            </div>

            <div className="flex justify-between items-start">
                <div className="font-serif min-h-[76px]">
                    <h3 className="text-base sm:text-lg font-semibold leading-snug line-clamp-2">{title}</h3>
                    <p className="text-sm py-0.5 text-zinc-400">by {author}</p>
                </div>
                <StatusBadge status={status} />
            </div>

            <div className="flex justify-between text-sm pt-2">
                <span>⭐ {rating} / 10</span>
                <span> 👁 {views.toLocaleString()}</span>
            </div>
        </div>
        </Link>
    );
}

export default ReviewCard;