import { useState } from "react";
import { useNavigate } from "react-router-dom";

function EditorAddMovie() {
  const [title, setTitle] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/movie`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title,
            releaseYear,
            posterUrl,
            description,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to add movie");
        return;
      }

      navigate("/movies");
    } catch {
      setError("Something went wrong");
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-serif mb-6">Add Movie</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full bg-black/40 border border-white/20 px-4 py-2 rounded"
        />

        <input
          type="number"
          placeholder="Release Year"
          value={releaseYear}
          onChange={e => setReleaseYear(e.target.value)}
          className="w-full bg-black/40 border border-white/20 px-4 py-2 rounded"
        />

        <input
          placeholder="Poster URL"
          value={posterUrl}
          onChange={e => setPosterUrl(e.target.value)}
          className="w-full bg-black/40 border border-white/20 px-4 py-2 rounded"
        />

        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full bg-black/40 border border-white/20 px-4 py-2 rounded"
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button className="w-full py-2 border border-white/30 rounded-full">
          Add Movie
        </button>
      </form>
    </div>
  );
}

export default EditorAddMovie;
