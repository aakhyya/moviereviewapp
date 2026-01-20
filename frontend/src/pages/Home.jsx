import ReviewCard from "../components/ReviewCard";
import { useEffect,useState } from "react";

function Home(){
    const [reviews,setReviews]=useState([]);
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        async function fetchReviews() {
            try{
                const res=await fetch(`${import.meta.env.VITE_API_BASE_URL}/review`);
                const data=await res.json();
                setReviews(data);
            }
            catch(err){
                console.log(`Failed to fetch reviews: ${err}`);
            }
            finally{
                setLoading(false);
            }
        }

        fetchReviews();
    }, []);

    return(
        <div className="space-y-4">
            {loading ? 
            (
                <p className="text-zinc-400 text-center">
                    Loading Reviews...
                </p>
            ) : reviews.length===0 ? 
            (
                <p className="text-zinc-400 text-center">
                    No reviews published yet🎬
                </p>
            ) :
            (reviews.map((review) => (
                <ReviewCard
                key={review._id}
                title={review.movietitle}
                author={review.author.name}
                rating={review.rating}
                views={review.views}
                status={review.status}
                />))
            )
            }
        </div>
    );
}

export default Home;