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
         <div className="max-w-sm mx-auto mt-24">
            <h1 className="text-2xl font-semibold mb-6">Login</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                required
                />

                <input
                type="password"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
                required
                />

                {error && (
                <p className="text-red-600 text-sm">{error}</p>
                )}

                <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded"
                >
                Login
                </button>
            </form>
        </div>
    );
}

export default Login;