import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";

function Navbar() {
  const { role, isAuthenticated } = useAuth();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.reload();
  }

  return (
    <nav className=" sticky top-0 z-50 bg-black/25 backdrop-blur-xl text-gray-300 border-b border-white/10">
      <div className="relative max-w-6xl mx-auto px-6 py-4 flex items-center">
        
        {/* LEFT SPACE (keeps center truly centered) */}
        <div className="flex-1">
          {!isAuthenticated && (
            <Link to="/login" className="text-sm opacity-80 hover:opacity-100">
              Login
            </Link>
          )}
        </div>

        {/* CENTER LOGO */}
        <h1 className="absolute left-1/2 -translate-x-1/2 text-2xl font-serif font-bold metallic-text">
          SCREENED
        </h1>

        {/* RIGHT ACTIONS */}
        <div className="flex-1 flex justify-end items-center gap-4 text-sm">
          {isAuthenticated && (
            <>
              <span className="capitalize opacity-70">{role}</span>

              {role === "critic" && (
                <Link to="/critic/reviews" className="hover:underline">
                  My Reviews
                </Link>
              )}

              {role === "editor" && (
                <>
                  <Link to="/editor" className="hover:underline">
                    Editor
                  </Link>
                  <Link to="/editor/audit" className="hover:underline">
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
