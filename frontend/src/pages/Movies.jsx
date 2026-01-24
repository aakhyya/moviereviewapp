import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Movies(){
    const [movies,setMovies]=useState([]);
    const [statsByMovie, setStatsByMovie] = useState({});
    const [loading, setLoading]=useState(true);
    const navigate=useNavigate();
    const {role}=useAuth();

    useEffect(()=>{
        async function fetchMovies() {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/movie`);
                const data = await res.json();
                setMovies(data);
            } 
            catch (err) {
                console.error("Failed to fetch movies", err);
            } 
            finally {
                setLoading(false);
            }
        }

        fetchMovies();
    },[]);

    useEffect(() => {
        if (!movies.length) return;

        async function fetchStats() {
            const results = await Promise.all( //all stats are fetched at once, no waterfall delay
            movies.map(movie =>
                fetch(`${import.meta.env.VITE_API_BASE_URL}/movie/${movie._id}/stats`)
                .then(res => res.json())
                .then(stats => ({ movieId: movie._id, stats })) // mapping movie to their respective 
                                                                // stats using movie._id
            )
            );

            const statsMap = {};
            results.forEach(({ movieId, stats }) => { //O(1) access by movieId, could scale 100s of movies
                statsMap[movieId] = stats;
            });

            setStatsByMovie(statsMap);
        }

        fetchStats();
        }, [movies]);


    if (loading) {
        return <p className="p-6 text-zinc-500">Loading movies...</p>;
    }


    return(
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-6">Movies</h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {movies.map((movie) => (
                <div key={movie._id} className="bg-velvet/90 text-ivory rounded-xl overflow-hidden">
                    <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full aspect-[2/3] object-cover"/>

                    <div className="p-4 space-y-2">
                    <h3 className="font-serif font-semibold leading-tight">
                        {movie.title}
                    </h3>

                    <p className="text-sm text-zinc-400">
                        {movie.releaseYear}
                    </p>

                    <p>
                        ⭐ {statsByMovie[movie._id]? statsByMovie[movie._id].avgRating.toFixed(1) : "—"}
                        <span className="text-xs text-zinc-400">
                            ({statsByMovie[movie._id]?.totalReviews || 0} reviews)
                        </span>
                    </p>

                    {role === "critic" && (
                        <button
                            onClick={() => navigate(`/movies/${movie._id}/review`)}
                            className="mt-2 text-sm underline"
                        >
                            Write Review
                        </button>
                    )}
                    </div>
                </div>
                ))}
            </div>
        </div>  
    );
}

export default Movies;