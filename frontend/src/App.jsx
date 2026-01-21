import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import {Routes, Route} from "react-router-dom";
import ReviewDetail from "./pages/ReviewDetail";

function App() {
  console.log(import.meta.env.VITE_API_BASE_URL);
  return (
    <div className="min-h-screen bg-ivory text-zinc-900">
      <Navbar/>
      
      <main className="max-w-5xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/review/:id" element={<ReviewDetail/>}/>
        </Routes>
      </main>
    </div>
  );
}

export default App;

//bg-rose-900