import { useState } from "react";
import {useNavigate} from "react-router-dom";


function RequestCritic(){
    const navigate=useNavigate();

    const [reason,setReason]=useState("");
    const [portfolioLink,setPortfolioLink]=useState("");
    const [error,setError]=useState("");
    const [loading,setLoading]=useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try{
            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/critic-request/request`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ reason, portfolioLink }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                setError(data?.error || "Request failed");
                setLoading(false);
                return;
            }

            navigate("/"); 
        }
        catch(err){
            setError("Something went wrong",err);
        } 
        finally {
            setLoading(false);
        }
    }

    return(
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl p-10 backdrop-blur-xl bg-white/5 border border-white/10">
                <h1 className="text-xl font-serif text-center mb-6 text-gray-200">
                    Request Critic Access
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                        placeholder="Why do you want to be a critic?"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-2 text-zinc-200"
                    />

                    <input
                        type="url"
                        placeholder="Portfolio link"
                        value={portfolioLink}
                        onChange={(e) => setPortfolioLink(e.target.value)}
                        className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-2 text-zinc-200"
                    />

                    {error && (
                        <p className="text-xs text-red-400 text-center">{error}</p>
                    )}

                    <button
                        disabled={loading}
                        className="w-full py-2 rounded-full border border-white/30 hover:bg-white/10 transition"
                    >
                        {loading ? "Submitting..." : "Submit Request"}
                    </button>
                </form>
            </div>
            </div>
    );
}

export default RequestCritic;