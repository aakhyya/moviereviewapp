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
import Movies from "./pages/Movies";
import EditorReviewDetail from "./pages/EditorReviewDetail";
import Footer from "./components/Footer";
import Signup from "./pages/Signup";
import AuthSuccess from "./pages/AuthSuccess";

function App() {
  return (
    <div className="min-h-screen flex flex-col text-textPrimary"
    style={{
    background:
      "linear-gradient(to top, oklch(37% 0.013 285.805) , oklch(20.5% 0 0)"
    }}>
      <Navbar/>
      
      <main className="flex-1 relative z-10 max-w-6xl mx-auto px-6 py-10 w-full">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/review/:id" element={<ReviewDetail/>}/>
          <Route path="/login" element={
            <PublicRoute>
              <Login/>
            </PublicRoute>
          }/>
          <Route path="/signup" element={
            <PublicRoute>
              <Signup/>
            </PublicRoute>
          }/>
          <Route path="/auth/success" element={<AuthSuccess/>} />


           {/* movies */}
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:movieId/review" element={
              <ProtectedRoute roles={["critic"]}>
                <CreateReview />
              </ProtectedRoute>
            }
          />

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
          <Route
            path="/editor/review/:id"
            element={
              <ProtectedRoute roles={["editor"]}>
                <EditorReviewDetail/>
              </ProtectedRoute>
            }
          />

          {/* critic */}
          <Route path="/critic/reviews" element={
            <ProtectedRoute roles={["critic"]}>
              <CriticReviews/>
            </ProtectedRoute>
          }/>
          <Route path="/critic/review/edit/:id" element={
            <ProtectedRoute roles={["critic"]}>
              <EditReview/>
            </ProtectedRoute>
          }
          />
        </Routes>
      </main>

      <Footer/>
    </div>
  );
}

export default App;

//bg-rose-900