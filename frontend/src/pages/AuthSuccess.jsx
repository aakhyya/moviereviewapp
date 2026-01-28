import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AuthSuccess(){
    const navigate=useNavigate();
    useEffect(()=>{
        const token=new URLSearchParams(window.location.search).get("token"); //Reads ?token=abc123
        if (token) {
            localStorage.setItem("token", token);
            navigate("/");
            window.location.reload();
        } 
        else {
            navigate("/login");
        }
    },[]);

    return null;
}

export default AuthSuccess;