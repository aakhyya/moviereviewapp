import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const { role, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.reload();
  }

  const canGoBack = location.pathname !== "/";

  return (
    <nav className="sticky top-0 z-50 bg-black/25 backdrop-blur-xl text-gray-300 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LEFT: Back + Logo */}
        <div className="flex items-center gap-3">
          {canGoBack && (
            <button
              onClick={() => navigate(-1)}
              title="Back"
              aria-label="Go back"
              className="text-sm opacity-60 hover:opacity-100 transition"
            >
              ←
            </button>
          )}

          <Link
            to="/"
            className="text-2xl font-serif font-bold metallic-text"
          >
            SCREENED
          </Link>
        </div>

        {/* RIGHT: Navigation */}
        <div className="flex items-center gap-4 text-sm">
          {!isAuthenticated && (
            <>
              <Link
                to="/login"
                className="text-gray-300 hover:text-gray-100 transition"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="text-gray-300 hover:text-gray-100 transition"
              >
                Sign Up
              </Link>
            </>
          )}


          {isAuthenticated && (
            <>
              <span className="capitalize opacity-60">
                {role}
              </span>

              {/* Global */}
              <Link
                to="/movies"
                className="opacity-80 hover:opacity-100 transition"
              >
                Movies
              </Link>

              {/* Role-specific */}
              {role === "critic" && (
                <Link to="/critic/reviews" className="opacity-80 hover:opacity-100 transition">
                  My Reviews
                </Link>
              )}

              {role === "editor" && (
                <>
                  <Link to="/editor" className="opacity-80 hover:opacity-100 transition">
                    Editor
                  </Link>
                  <Link to="/editor/audit" className="opacity-80 hover:opacity-100 transition">
                    Audit
                  </Link>
                </>
              )}

              <button
                onClick={handleLogout}
                className="opacity-80 hover:opacity-100 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
