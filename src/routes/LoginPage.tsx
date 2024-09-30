import { useAuth } from "../auth/authProvider";

export default function Login() {
    const user=useAuth();
    return (
        <div onClick={()=>user?.loginAction({username:"",password:""})} className="flex items-center justify-center h-screen text-lg">
            Login
        </div>
    )
}