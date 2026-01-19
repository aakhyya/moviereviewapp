import Navbar from "./components/Navbar";
import ReviewCard from "./components/ReviewCard";
function App() {
  return (
    <div className="h-screen bg-zinc-950 text-white">
      <Navbar/>
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-6">
          Published Reviews
        </h1>
        <ReviewCard 
        title="Pulp Fiction"
        author="Roger Ebert"
        rating={9}
        views={2300}
        status="archived"/>
      </main>
    </div>
  );
}

export default App;

//bg-rose-900