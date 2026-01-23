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
        
        <div className="bg-ivory p-10 shadow-lg rounded-xl">
        <div className="grid 
                        grid-cols-1
                        sm:grid-cols-2
                        md:grid-cols-3
                        lg:grid-cols-4
                        gap-6">
            {loading ? 
            (
                <p className="text-zinc-400 text-center col-span-full">
                    Loading Reviews...
                </p>
            ) : reviews.length===0 ? 
            (
                <p className="text-zinc-400 text-center col-span-full">
                    No reviews published yet🎬
                </p>
            ) :
            (reviews.map((review) => (
                <ReviewCard
                key={review._id}
                review={review}
                />))
            )
            }
        </div>
        </div>
    );
}

export default Home;



// Mobile: 1 column
// Tablet: 2 columns
// Laptop: 3 columns
// Desktop: 4 columns