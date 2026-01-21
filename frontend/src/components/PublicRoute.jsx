import useAuth from "../hooks/useAuth";

function PublicRoute({children}){
    const {isAuthenticated}=useAuth();

    if(isAuthenticated){
        return <Navigate to="/" replace/>;
    }

    return children;
}

export default PublicRoute;