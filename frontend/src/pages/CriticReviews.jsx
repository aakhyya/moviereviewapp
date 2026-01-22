import { useEffect, useState } from "react";
import ReviewCard from "../components/ReviewCard";

function CriticReviews(){
    
  console.log("CRITIC REVIEWS PAGE");
    const [reviews,setReviews]=useState([]);
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        async function fetchMyReviews() {
            try{
                const res=await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/review/mine`,
                    {
                        headers:{
                            "authorization": `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                const data=await res.json();
                setReviews(data);
            }
            catch(err){
                console.log(`Failed to fetch critic reviews: ${err}`);
            }
            finally{
                setLoading(false);
            }
        }

        fetchMyReviews();
    },[]);

    async function submitReview(id) {
        await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/review/${id}/submit`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

        setReviews((prev) =>
            prev.map((r) => r._id === id ? { ...r, status: "in-review" } : r));
    }

    async function resubmitReview(id) {
        try {
            if (!confirm("Resubmit this review for editor approval?")) return;
            const res = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/review/${id}/resubmit`,
            {
                method: "POST",
                headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
            );

            if (!res.ok) throw new Error("Resubmission failed");

            setReviews((prev) =>
            prev.map((r) =>
                r._id === id ? { ...r, status: "in-review" } : r
            )
            );
        } catch (err) {
            console.error(err);
        }
    }
    
    if(loading){
        return <p className="text-zinc-500">Loading your reviews...</p>
    }

    if(reviews.length===0){
        return <p className="text-zinc-500">You haven't written any reviews yet.</p>
    }

    return(
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold font-serif">
                My Reviews
            </h1>   
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review) => (
                <div key={review._id} className="space-y-2">
                    <ReviewCard
                    id={review._id}
                    title={review.movietitle}
                    author="You"
                    rating={review.rating}
                    views={review.views}
                    status={review.status}
                    posterUrl="https://upload.wikimedia.org/wikipedia/commons/4/40/Jaws_movie_poster.jpg"
                    showActions
                    onSubmit={submitReview}
                    onResubmit={resubmitReview}
                    />
                    
                    {review.status === "rejected" && (
                    <div className="text-sm bg-red-50 text-red-700 p-3 rounded">
                        <p className="font-semibold">Rejected</p>
                        <p className="italic">"{review.rejectedreason}"</p>
                    </div>
                    )}

                    {review.status === "rejected" && (
                        <button
                            onClick={() => resubmitReview(review._id)}
                            className="mt-3 px-4 py-2 bg-velvet text-ivory rounded hover:opacity-90"
                        >
                            Resubmit
                        </button>
                    )}
                </div>))}
            </div>
        </div>
    );
}

export default CriticReviews;