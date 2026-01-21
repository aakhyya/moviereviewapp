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
    <nav className="sticky top-0 z-50 bg-velvet text-ivory border-b border-black/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between">
        <h1 className="text-2xl font-serif font-semibold tracking-wide">
          Screened
        </h1>
        {!isAuthenticated ? (<Link to="/login">Login</Link>) :
        (<div className="flex items-center gap-4">
          <span className="capitalize text-sm">{role}</span>
          <button onClick={handleLogout} className="text-sm opacity-80 hover:opacity-100 transition">
            Logout
          </button>
        </div>)}
      </div>
    </nav>
    );
}

export default Navbar;