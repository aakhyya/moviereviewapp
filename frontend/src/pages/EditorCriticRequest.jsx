import { useEffect, useState } from "react";

function EditorCriticRequest() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRequests() {
            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/critic-request/pending`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            const data = await res.json();
            setRequests(data);
            setLoading(false);
        }

        fetchRequests();
    }, []);

    async function handleAction(id, action) {
        await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/critic-request/${id}/${action}`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

        setRequests((prev) => prev.filter((r) => r._id !== id));
    }

    if (loading) return <p className="text-center">Loading...</p>;
    if(!requests) return <p className="text-center">No critic requests yet...</p>

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-xl font-serif mb-6">Critic Requests</h1>
            {requests.map((req) => (
                <div
                    key={req._id}
                    className="
      relative
      mb-4
      p-4
      border border-white/10
      rounded-lg
      bg-white/5
    "
                >
                    {/* Top-right portfolio button */}
                    {req.portfolioLink && (
                        <a
                            href={req.portfolioLink}
                            target="_blank"
                            rel="noreferrer" 
                            // Blocks referrer: external site has zero context about Screened
                            // avoids reverse tabnabbing: window.opener is null, 
                            // The new page cannot control the original tab.
                            className="
                                        absolute
                                        top-3
                                        right-3
                                        px-4
                                        py-2
                                        text-sm
                                        border border-white/20
                                        rounded-full
                                        opacity-70
                                        hover:opacity-100
                                        hover:bg-white/10
                                        transition">
                            View Portfolio
                        </a>
                    )}

                    <p className="text-md font-serif first-letter:capitalize text-gray-200">
                        <strong>{req.user.name}</strong>
                    </p>

                    <p className="text-sm text-gray-200">
                        {req.user.email}
                    </p>

                    {req.reason && (
                        <p className="text-sm mt-2 opacity-80">
                            {req.reason}
                        </p>
                    )}

                    <div className="mt-4 flex gap-3">
                        <button
                            onClick={() => handleAction(req._id, "approve")}
                            className="
                                        px-4
                                        py-1
                                        border
                                        border-green-400/40
                                        rounded-full
                                        hover:bg-green-400/10
                                        transition">
                            Approve
                        </button>

                        <button
                            onClick={() => handleAction(req._id, "reject")}
                            className="
                                        px-4
                                        py-1
                                        border
                                        border-red-400/40
                                        rounded-full
                                        hover:bg-red-400/10
                                        transition">
                            Reject
                        </button>
                    </div>
                </div>
            ))}

        </div>
    );
}

export default EditorCriticRequest;