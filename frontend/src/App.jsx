import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import {Routes, Route} from "react-router-dom";
import ReviewDetail from "./pages/ReviewDetail";
import Login from "./pages/Login";
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import CriticReviews from "./pages/CriticReviews";
import EditorDashboard from "./pages/EditorDashboard";
import AuditLog from "./pages/AuditLog";
import CreateReview from "./pages/CreateReview";
import EditReview from "./pages/EditReview";

function App() {
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

          {/* editor */}
          <Route path="/editor" element={
            <ProtectedRoute roles={["editor"]}>
              <EditorDashboard/>
            </ProtectedRoute>
          }/> 
          <Route path="/editor/audit" element={
            <ProtectedRoute roles={["editor"]}>
              <AuditLog/>
            </ProtectedRoute>
          }/>

          {/* critic */}
          <Route path="/critic/reviews" element={
            <ProtectedRoute roles={["critic"]}>
              <CriticReviews/>
            </ProtectedRoute>
          }/>
          <Route path="/critic/review/new/:movieId" element={
            <ProtectedRoute roles={["critic"]}>
              <CreateReview/>
            </ProtectedRoute>
          }
          />
          <Route path="/critic/review/edit/:id" element={
            <ProtectedRoute roles={["critic"]}>
              <EditReview/>
            </ProtectedRoute>
          }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;

//bg-rose-900