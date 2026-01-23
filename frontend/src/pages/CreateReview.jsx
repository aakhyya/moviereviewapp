import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function CreateReview() {
  const { movieId } = useParams(); //currently movietitle
  const navigate = useNavigate();

  const [rating, setRating] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!rating || !content) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      // Create draft review
      const createRes = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            movietitle: movieId, // backend expects this
            rating,
            content,
          }),
        }
      );

      const createdReview = await createRes.json();

      if (!createRes.ok) {
        setError(createdReview?.error || "Failed to create review");
        setLoading(false);
        return;
      }

      // Submit draft for editor review
      const submitRes = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/review/${createdReview._id}/submit`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!submitRes.ok) {
        setError("Draft created but failed to submit for review");
        setLoading(false);
        return;
      }

      // Success → redirect
      navigate("/critic/reviews");
    } 
    catch (err) {
      setError("Something went wrong. Please try again.",err);
    } 
    finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Write a Review</h1>
      {error && (
        <p className="mb-3 text-red-500 text-sm">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Rating (1-10)
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Review
          </label>
          <textarea
            rows="6"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Write your review here..."/>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50">
          {loading ? "Submitting..." : "Submit for Review"}
        </button>
      </form>
    </div>
  );
}

export default CreateReview;
