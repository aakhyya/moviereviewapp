import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import {Routes, Route} from "react-router-dom";
import ReviewDetail from "./pages/ReviewDetail";
import Login from "./pages/Login";
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import EditorDashboard from "./components/EditorDashboard";
import CriticDashboard from "./components/CriticDashboard";

function App() {
  console.log(import.meta.env.VITE_API_BASE_URL);
  return (
    <div className="min-h-screen bg-ivory text-zinc-900">
      <Navbar/>
      
      <main className="max-w-5xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/review/:id" element={<ReviewDetail/>}/>
          <Route path="/login" element={
            <PublicRoute>
              <Login/>
            </PublicRoute>
          }/>
          <Route path="/editor" element={
            <ProtectedRoute roles={["editor"]}>
              <EditorDashboard/>
            </ProtectedRoute>
          }/>
          <Route path="/critic" element={
            <ProtectedRoute roles={["critic"]}>
              <CriticDashboard/>
            </ProtectedRoute>
          }/>
        </Routes>
      </main>
    </div>
  );
}

export default App;

//bg-rose-900