import { useEffect, useState } from "react";
import ReviewCard from "../components/ReviewCard";
import { useNavigate } from "react-router-dom";

function CriticReviews(){
    const [reviews,setReviews]=useState([]);
    const [loading,setLoading]=useState(true);
    const navigate=useNavigate();

    useEffect(()=>{
        async function fetchMyReviews() {
            try{
                const res=await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/review/mine`,
                    {
                        headers:{
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
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

    if(loading){
        return <p className="text-zinc-500">Loading your reviews...</p>
    }

    const inreview=reviews.filter(r=> r.status==="in-review");
    const rejected=reviews.filter(r=> r.status==="rejected");
    const published=reviews.filter(r=> r.status==="published");

    if(reviews.length===0){
        return <p className="text-zinc-500">You haven't written any reviews yet.</p>
    }
    console.log(reviews);

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-10">
            <h1 className="text-2xl font-semibold">My Reviews</h1>

            {/* In Review */}
            <Section title="In Review" reviews={inreview} />

            {/* Rejected */}
            <Section
                title="Rejected"
                reviews={rejected}
                renderExtra={(review) => (
                <>
                    <p className="text-sm text-red-500 mt-2">
                    Reason: {review.rejectedreason}
                    </p>
                    <button
                    onClick={() => navigate(`/critic/review/edit/${review._id}`)}
                    className="mt-2 text-sm underline">
                        Edit & Resubmit
                    </button>
                </>
                )}
            />

            {/* Published */}
            <Section title="Published" reviews={published} />
        </div>
    );
}

function Section({ title, reviews, renderExtra }) {
  if (reviews.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-medium mb-4">{title}</h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review._id} review={review}>
            {renderExtra && renderExtra(review)} 
            {/* if renderExtra exists, send extra details wrt that review */}
          </ReviewCard>
        ))}
      </div>
    </section>
  );
}


export default CriticReviews;