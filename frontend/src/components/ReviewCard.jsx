import StatusBadge from "./StatusBadge";
function ReviewCard({title,author,rating,views,status}){
    return(
        <div className="cursor-pointer bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg p-5 space-y-3">
            <div className="flex justify-between items-start">
                <div className="font-serif">
                    <h3 className="text-base sm:text-lg font-semibold">{title}</h3>
                    <p className="text-sm py-0.5 text-zinc-400">by {author}</p>
                </div>
                <StatusBadge status={status} />
            </div>

            <div className="flex justify-between text-sm text-zinc-500 pt-2">
                <span>⭐ {rating} / 10</span>
                <span>{views.toLocaleString()} views</span>
            </div>
        </div>
    );
}

export default ReviewCard;