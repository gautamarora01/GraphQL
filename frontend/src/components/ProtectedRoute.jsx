import { Navigate } from "react-router-dom";

function ProtectedRoute({children}){
    const storedData = JSON.parse(localStorage.getItem('authData'));
    const token = storedData?.token;
    const expiration = storedData?.expiration;

    const isValid = token && new Date(expiration) > new Date();

    if(!isValid){
        return <Navigate to={'/auth'} replace/>
    }

    return children;
}

export default ProtectedRoute;