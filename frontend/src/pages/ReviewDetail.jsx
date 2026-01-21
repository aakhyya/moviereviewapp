import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function ReviewDetail(){
    const {id}=useParams();
    const [review, setReview]=useState(null);
    const [loading,setLoading]=useState(true);
    const navigate=useNavigate();

    const {role}=useAuth();

    useEffect(()=>{
        async function fetchReview() {
            try{
                const res=await fetch(`${import.meta.env.VITE_API_BASE_URL}/review/${id}`);
                const data=await res.json();
                setReview(data);
            }
            catch(err){
                console.log(`Couldn't fetch review: ${err}`);
            }
            finally{
                setLoading(false);
            }
        }

        fetchReview();

    },[id]);

    if(loading){
        return(
            <p className="text-zinc-400">Loading Review...</p>
        )
    }

    if(!review){
        return(
            <p className="text-zinc-400">Review not found</p>
        )
    }

    return(
       <div className="max-w-3xl mx-auto space-y-6">
            <button
                onClick={() => navigate(-1)}
                className="text-sm text-zinc-400 hover:text-velvet transition"
            >
                ← Back
            </button>

            <div className="relative h-[280px] md:h-[340px] rounded-xl overflow-hidden">
                <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/40/Jaws_movie_poster.jpg"
                alt={review.movietitle}
                className="absolute inset-0 w-full h-full  bg-velvet opacity-90 object-cover blur-sm scale-100 "
                />

                <div className="relative h-full p-8 flex flex-col justify-end bg-gradient-to-t from-zinc-950/90 via-zinc-950/60 to-transparent text-ivory">
                    <h1 className="text-3xl md:text-4xl font-bold leading-tight font-serif">
                        {review.movietitle}
                    </h1>

                    <p className="opacity-80 mt-1 font-serif">
                        by {review.author.name}
                    </p>

                    <div className="flex gap-6 text-sm text-zinc-300 mt-6">
                        <span>⭐ {review.rating} / 10</span>
                        <span>👁 {review.views} views</span>
                        <span className="capitalize">{review.status}</span>
                    </div>
                </div>
            </div>

            <div className="bg-ivory p-10 shadow-lg rounded-xl">
                <div className="border-t border-black/10 pt-6">
                    <p className="text-velvet leading-snug whitespace-pre-line font-mono">
                    {review.content}
                    </p>
                </div>
            </div>

            <div className="flex gap-4 mt-6">
            {/* CRITIC */}
            {role === "critic" && review.status === "draft" && (
                <button className="px-4 py-2 bg-velvet text-ivory rounded">
                Submit for review
                </button>
            )}

            {role === "critic" && review.status === "rejected" && (
                <button className="px-4 py-2 bg-velvet text-ivory rounded">
                Resubmit
                </button>
            )}

            {/* EDITOR */}
            {role === "editor" && review.status === "in-review" && (
                <>
                <button className="px-4 py-2 bg-green-700 text-white rounded">
                    Approve
                </button>
                <button className="px-4 py-2 bg-red-700 text-white rounded">
                    Reject
                </button>
                </>
            )}
            </div>
        </div>
    );
}

export default ReviewDetail;