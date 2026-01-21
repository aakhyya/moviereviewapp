import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

function ProtectedRoute({children,roles}){
    const {isAuthenticated, role}=useAuth();

    //Not logged in
    if(!isAuthenticated){
        return <Navigate to="/login" replace/>;
    }

    //Logged in
    if(roles && !roles.includes(role)){
        return <Navigate to="/" replace/>;
    }

    return children;
}

export default ProtectedRoute;