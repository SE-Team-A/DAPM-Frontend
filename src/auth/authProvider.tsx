import { useContext, createContext, useState, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";


interface AuthContextType {
    user: string | null;
    token: string;
    loginAction: (data: { username: string; password: string }) => Promise<void>;
    logOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("site") || "");
    const navigate = useNavigate();


    const loginAction = async (data: { username: string; password: string }) => {
        // try {
        //     const response = await fetch("", {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify(data),
        //     });
        //     const res = await response.json();

        //     if (res) {
        //         console.log(res)
        //         setUser(res.username);
        //         setToken(res.token);
        //         localStorage.setItem("site", res.token);
        //         navigate("/pipeline");
        //         return;
        //     }
        //     throw new Error(res.message);

        // } catch (err) {
        //     console.log(err);
        // }

        setToken("dfsd");

        if (token) {
            navigate("/pipeline");
            return;
        }
    }

    useEffect(() => {

        const intervalId = setInterval(() => {
            // if(token)
            logOut();
        }, 10000);

        return () => clearInterval(intervalId);
    }, []);


    const logOut = () => {
        setUser(null);
        setToken("");
        localStorage.removeItem("site");
        navigate("/login")
    }


    return <AuthContext.Provider value={{ token, user, loginAction, logOut }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};