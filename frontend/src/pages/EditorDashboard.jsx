import { useEffect, useState } from "react";
import ReviewCard from "../components/ReviewCard";

function EditorDashboard() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal state
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    async function fetchInReviews() {
      try {
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
      } catch (err) {
        console.error(`Failed to fetch in-review reviews: ${err}`);
      } finally {
        setLoading(false);
      }
    }

    fetchInReviews();
  }, []);

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
      setReviews(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  async function confirmReject() {
    if (!rejectReason.trim()) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/review/${rejectingId}/reject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ reason: rejectReason }),
        }
      );

      if (!res.ok) throw new Error("Reject failed");

      setReviews(prev => prev.filter(r => r._id !== rejectingId));
      setRejectingId(null);
      setRejectReason("");
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return <p className="text-zinc-500 text-sm">Loading editor queue…</p>;
  }

  if (reviews.length === 0) {
    return <p className="text-zinc-500 text-sm">No reviews pending approval</p>;
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-xl font-serif tracking-widest text-zinc-200">
          EDITOR QUEUE
        </h1>
        <p className="text-xs tracking-wide text-zinc-400">
          Reviews awaiting final decision
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map(review => (
          <ReviewCard key={review._id} review={review}>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => approveReview(review._id)}
                className="
                  px-3 py-1.5
                  text-[10px]
                  tracking-widest
                  uppercase
                  rounded-full
                  border border-white/30
                  text-zinc-100
                  hover:bg-white/15
                  transition
                "
              >
                Approve
              </button>

              <button
                onClick={() => setRejectingId(review._id)}
                className="
                  px-3 py-1.5
                  text-[10px]
                  tracking-widest
                  uppercase
                  rounded-full
                  border border-white/30
                  text-zinc-100
                  hover:bg-white/15
                  transition
                "
              >
                Reject
              </button>
            </div>
          </ReviewCard>
        ))}
      </div>

      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div
            className="
              w-full max-w-md
              rounded-2xl
              p-8
              space-y-4
              bg-gradient-to-br
              from-white/10 via-white/5 to-white/10
              backdrop-blur-xl
              border border-white/20
              shadow-[0_20px_60px_rgba(0,0,0,0.7)]
            "
          >
            <h2 className="text-lg font-serif text-zinc-100 tracking-wide">
              Provide feedback for the critic
            </h2>

            <textarea
              rows="4"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection…"
              className="
                w-full
                bg-black/40
                border border-white/20
                rounded-lg
                px-4 py-2
                text-zinc-100
                placeholder-zinc-500
                focus:outline-none
                focus:border-white/40
                resize-none
              "
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setRejectingId(null);
                  setRejectReason("");
                }}
                className="
                  text-xs
                  tracking-widest
                  uppercase
                  text-zinc-400
                  hover:text-zinc-200
                "
              >
                Cancel
              </button>

              <button
                onClick={confirmReject}
                className="
                  px-4 py-2
                  text-xs
                  tracking-widest
                  uppercase
                  rounded-full
                  border border-white/30
                  text-zinc-100
                  hover:bg-white/15
                  transition
                "
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditorDashboard;
