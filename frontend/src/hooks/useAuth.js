import { useMemo } from "react";
import getAuthUser from "../utils/auth"
//hooks are centralised and consistent, instead of calling getAuthUser everywhere.
function useAuth(){
    const user=useMemo(()=>getAuthUser(),[]);
    //useMemo caches the result when it call getAuthUser once, so it doesn't have to recompute everytime.
    return{
        user, //payload
        isAuthenticated: !!user, // !! converts into boolean -> if obj: true, if null: false
        role: user?.role || "viewer" //default role is viewer.
    };
}

export default useAuth;