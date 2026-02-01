import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Film,
  Library,
  ShieldCheck,
  ClipboardList,
  UserPlus,
  LogOut,
  ArrowLeft,
} from "lucide-react";

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
    <nav className="sticky top-0 z-50 bg-black/30 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* LEFT: Back + Logo */}
        <div className="flex items-center gap-4">
          {canGoBack && (
            <button
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="group relative"
            >
              <NeonIcon>
                <ArrowLeft size={18} />
              </NeonIcon>
              <HoverLabel text="Back" />
            </button>
          )}

          <Link
            to="/"
            className="text-xl font-serif font-bold metallic-text tracking-widest"
          >
            SCREENED
          </Link>
        </div>

        {/* RIGHT: Icon Navigation */}
        <div className="flex items-center gap-4">
          {!isAuthenticated && (
            <>
              <NavIcon to="/login" label="Login">
                <ShieldCheck size={18} />
              </NavIcon>

              <NavIcon to="/signup" label="Sign Up">
                <UserPlus size={18} />
              </NavIcon>
            </>
          )}

          {isAuthenticated && (
            <>
              {/* Movies */}
              <NavIcon to="/movies" label="Movies">
                <Film size={18} />
              </NavIcon>

              {/* Critic */}
              {role === "critic" && (
                <NavIcon to="/critic/reviews" label="My Reviews">
                  <Library size={18} />
                </NavIcon>
              )}

              {/* Editor */}
              {role === "editor" && (
                <>
                  <NavIcon to="/editor" label="Editor Queue">
                    <ClipboardList size={18} />
                  </NavIcon>

                  <NavIcon to="/editor/audit" label="Audit Logs">
                    <ShieldCheck size={18} />
                  </NavIcon>
                </>
              )}

              {/* Viewer */}
              {role === "viewer" && (
                <NavIcon to="/request-critic" label="Become a Critic">
                  <UserPlus size={18} />
                </NavIcon>
              )}

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="group relative"
              >
                <NeonIcon>
                  <LogOut size={18} />
                </NeonIcon>
                <HoverLabel text="Logout" />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
function NavIcon({ to, label, children }) {
  return (
    <Link to={to} className="group relative">
      <NeonIcon>{children}</NeonIcon>
      <HoverLabel text={label} />
    </Link>
  );
}

function NeonIcon({ children }) {
  return (
    <div
      className="
        relative
        p-2
        rounded-full
        border border-white/20
        text-zinc-300
        transition
        group-hover:text-white
        group-hover:border-white/40
        group-hover:shadow-[0_0_18px_rgba(180,220,255,0.35)]
      "
    >
      {/* neon pulse ring */}
      <span
        className="
          pointer-events-none
          absolute inset-0
          rounded-full
          opacity-0
          group-hover:opacity-100
          group-hover:animate-pulse
          ring-1 ring-white/40
        "
      />
      {children}
    </div>
  );
}

function HoverLabel({ text }) {
  return (
    <span
      className="
        pointer-events-none
        absolute
        top-full
        left-1/2
        -translate-x-1/2
        mt-3

        px-3 py-1
        text-[10px]
        tracking-widest uppercase
        rounded-full
        bg-black/80
        border border-white/20
        text-zinc-200

        opacity-0 scale-95
        group-hover:opacity-100
        group-hover:scale-100

        transition-all duration-200
        whitespace-nowrap
      "
    >
      {text}
    </span>
  );
}


export default Navbar;
