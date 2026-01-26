import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";

function Navbar(){
    const { user, role, isAuthenticated } = useAuth();
    console.log(user, role, isAuthenticated);
    function handleLogout() {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.reload();
    }
    return(
    <nav className="bg-black/25 backdrop-blur-xl  text-red-100">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-serif font-bold">
          Screened
        </h1>
        {!isAuthenticated ? (<Link to="/login">Login</Link>) :
        (<div className="flex items-center gap-4">
          <span className="capitalize text-sm">{role}</span>
          <button onClick={handleLogout} className="text-sm opacity-80 hover:opacity-100 transition">
            Logout
          </button>
          {role === "critic" && (
            <Link to="/critic/reviews" className="text-sm hover:underline">
              My Reviews
            </Link>
          )}
          {role === "editor" && (
            <Link to="/editor" className="hover:underline">
              Editor
            </Link>
          )}
          {role === "editor" && (
            <Link to="/editor/audit" className="hover:underline">
              Audit
            </Link>
          )}
          </div>)}
      </div>
    </nav>
    );
}

export default Navbar;