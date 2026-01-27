import { useState } from "react"
import {useNavigate} from "react-router-dom";

//takes email+password -> stores token(only place where token is set) -> verify 
function Login(){
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [error,setError]=useState("");
    const navigate=useNavigate();

    async function handleSubmit(e) {
        e.preventDefault(); //prevents page reload, required for forms in React
        setError(null);

        try{
            const res=await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
                {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json",
                    },
                    body:JSON.stringify({email,password}),
                }
            );
            const data=await res.json();
            if(!res.ok){
                setError(data?.error || "Login failed");
                return;
            }

            //Store auth data
            localStorage.setItem("token",data.token);
            localStorage.setItem("role",data.user.role);

            navigate("/"); //moving user back to app
            window.location.reload(); //useAuth hook works on mount, this forces page to reload.
        }
        catch(err){
            setError(`Something went wrong: ${err}`);
        }
    }

    return(
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
            Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
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
            LOGIN
            </button>
        </form>
        </div>
    </div>
    );
}

export default Login;