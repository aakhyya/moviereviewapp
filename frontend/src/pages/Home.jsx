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
    return (
  <div className="relative space-y-10">
    {/* Page header */}
    <div className="text-center space-y-2">
      <h1 className="text-xl font-serif tracking-widest text-zinc-200">
        LATEST REVIEWS
      </h1>
      <p className="text-xs text-zinc-400 tracking-wide">
        Curated film criticism
      </p>
    </div>

    {/* Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
      {loading ? (
        <p className="col-span-full text-center text-zinc-400 text-sm">
          Loading reviews…
        </p>
      ) : reviews.length === 0 ? (
        <p className="col-span-full text-center text-zinc-400 text-sm">
          No reviews published yet
        </p>
      ) : (
        reviews.map(review => (
          <ReviewCard key={review._id} review={review} />
        ))
      )}
    </div>
  </div>
);

}

export default Home;



// Mobile: 1 column
// Tablet: 2 columns
// Laptop: 3 columns
// Desktop: 4 columns