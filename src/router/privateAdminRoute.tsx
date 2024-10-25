import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/authProvider";
export default function PrivateAdminRoute(){
    const user=useAuth();
    console.log("I am token:", user)
    if(user?.user?.isAdmin==="false") return <Navigate to="/"/>
    return <Outlet></Outlet>
}