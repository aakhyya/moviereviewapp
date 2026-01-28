import { useState } from "react";
import {useNavigate} from "react-router-dom";
function Signup() {
    const navigate=useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSignup(e) {
        e.preventDefault();
        setError(null);
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/auth/signup`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ name, email, password }),
                }
            );

            const data = await res.json();
            if (!res.ok) {
                setError(data?.error || "Signup Failed");
                return;
            }

            navigate("/login"); //for jwt creation
        }
        catch (err) {
            setError("Something went wrong",err);
        }
    }

    function handleGoogleSignup() {
        window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
    } //not naviagting as it's a full browser redirect, not an in-app route change.

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div
                className="
          w-full max-w-md
          rounded-2xl
          p-12
          backdrop-blur-xl
          bg-gradient-to-br
          from-white/10 via-white/5 to-white/10
          border border-white/20
          shadow-[0_20px_60px_rgba(0,0,0,0.6)]
        "
            >
                <h1 className="text-2xl font-serif font-bold text-gray-200 tracking-wider text-center mb-8">
                    Create Account
                </h1>

                {/* Local Signup */}
                <form onSubmit={handleSignup} className="space-y-5">
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="
              w-full
              bg-black/40
              border border-white/20
              rounded-lg
              px-4 py-2
              text-zinc-200
              placeholder-zinc-500
              focus:outline-none
              focus:border-white/40
            "
                        required
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="
              w-full
              bg-black/40
              border border-white/20
              rounded-lg
              px-4 py-2
              text-zinc-200
              placeholder-zinc-500
              focus:outline-none
              focus:border-white/40
            "
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="
              w-full
              bg-black/40
              border border-white/20
              rounded-lg
              px-4 py-2
              text-zinc-200
              placeholder-zinc-500
              focus:outline-none
              focus:border-white/40
            "
                        required
                    />

                    {error && (
                        <p className="text-xs tracking-wide text-zinc-300 text-center">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="
              w-full
              mt-2
              py-2
              rounded-full
              border border-white/30
              text-zinc-100
              tracking-widest
              hover:bg-white/10
              transition
            "
                    >
                        SIGN UP
                    </button>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center gap-4">
                    <div className="flex-1 h-px bg-white/20" />
                    <span className="text-xs text-zinc-400 tracking-widest">OR</span>
                    <div className="flex-1 h-px bg-white/20" />
                </div>

                {/* Google Signup */}
                <button
                    type="button"
                    onClick={handleGoogleSignup}
                    className="
            w-full
            py-2
            rounded-full
            border border-white/30
            text-zinc-100
            tracking-widest
            hover:bg-white/10
            transition
            flex items-center justify-center gap-3
          "
                >
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/500px-Google_%22G%22_logo.svg.png"
                        alt="Google"
                        className="w-4 h-4"
                    />
                    CONTINUE WITH GOOGLE
                </button>

                {/* Footer */}
                <p className="mt-6 text-xs text-zinc-400 text-center">
                    Already have an account?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="no-underline cursor-pointer text-zinc-200 hover:underline">
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Signup;