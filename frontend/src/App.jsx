import Navbar from "./components/Navbar";
import Home from "./pages/Home";
function App() {
  console.log(import.meta.env.VITE_API_BASE_URL);
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar/>
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-6">
          Published Reviews
        </h1>
        <Home/>
      </main>
    </div>
  );
}

export default App;

//bg-rose-900