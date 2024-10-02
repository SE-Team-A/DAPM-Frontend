import { useAuth } from "../auth/authProvider";
import LoginForm from "../components/login/loginFrom";

export default function Login() {
    const user=useAuth();
    return (
        <div 
        // onClick={()=>user?.loginAction({username:"",password:""})} 
        className="flex items-center justify-center h-screen w-full text-lg ">
            
            <div className=" lg:h-[65%] lg:w-[32%] md:h-[65%] md:w-[40%] sm:h-[65%] sm:w-[80%] h-[100%] w-[100%] bg-[#292929] px-12 py-8 sm:border-2 border-white sm:rounded-xl">
                <h1 className="text-white text-3xl font-bold">DAPM</h1>
                <LoginForm></LoginForm>
            </div>
        </div>
    )
}