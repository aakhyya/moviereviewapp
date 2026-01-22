import { useEffect, useState } from "react";
import ReviewCard from "../components/ReviewCard";

function EditorDashboard(){
    const [reviews,setReviews]=useState([]);
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        async function fetchInReviews() {
            try{
                const res = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/review/in-review`,
                    {
                        headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                const data = await res.json();
                setReviews(data);
            }
            catch(err){
                console.error(`Failed to fetch in-review reviews: ${err}`);
            }
            finally{
                setLoading(false);
            }
        }

        fetchInReviews();
    },[]);

    
    async function approveReview(id) {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/review/${id}/approve`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (!res.ok) throw new Error("Approve failed");
            //remove from in-review
            setReviews((prev) => prev.filter((r) => r._id !== id));
        } 
        catch (err) {
            console.error(err);
        }
    }

    async function rejectReview(id) {
        const reason = prompt("Why are you rejecting this review?");
        if (!reason) return;

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/review/${id}/reject`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ reason }),
                }
            );

            if (!res.ok) throw new Error("Reject failed");

            // remove from in-review
            setReviews((prev) => prev.filter((r) => r._id !== id));
        } 
        catch (err) {
            console.error(err);
        }
    }

    if(loading){
        return <p className="text-zinc-500">Loading editor queue...</p>
    }

    if(reviews.length===0){
        return <p className="text-zinc-500">No reviews pending approval</p>
    }

    return(
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold font-serif">
                Editor Review Queue
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review) => (
                <div key={review._id} className="space-y-3">
                    <ReviewCard
                    id={review._id}
                    title={review.movietitle}
                    author={review.author.name}
                    rating={review.rating}
                    views={review.views}
                    status={review.status}
                    posterUrl="https://upload.wikimedia.org/wikipedia/commons/4/40/Jaws_movie_poster.jpg"
                    />

                    <div className="flex gap-3">
                        <button
                            onClick={() => approveReview(review._id)}
                            className="px-4 py-2 bg-green-700 text-white rounded hover:opacity-90"
                        >
                            Approve
                        </button>

                        <button
                            onClick={() => rejectReview(review._id)}
                            className="px-4 py-2 bg-red-700 text-white rounded hover:opacity-90"
                        >
                            Reject
                        </button>
                    </div>
                </div>
                ))}
            </div>
        </div>
    );
}

export default EditorDashboard;