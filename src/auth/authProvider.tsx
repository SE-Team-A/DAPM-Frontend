import { useContext, createContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface User {
    id: string;
    username: string;
    isAdmin: boolean;  
}

interface AuthContextType {
    user:  User| null;
    token: string;
    loginAction: (data: { username: string; password: string }) => Promise<void>;
    logOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null; // Parse JSON or return null
    });
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const navigate = useNavigate();


    const loginAction = async (data: { username: string; password: string }) => {
        try {
            const response = await fetch("http://localhost:5281/authentication/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const res = await response.json();

            if (res) {

                const ticketId = res.ticketId;

                await new Promise((resolve) => setTimeout(resolve, 2000));
                const statusResponse = await fetch(`http://localhost:5281/status/${ticketId}`, {
                    method: "GET", 
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const statusRes = await statusResponse.json();

                // Check if the status retrieval succeeded
                if (statusRes.result.succeeded) {

                    localStorage.setItem("token", statusRes.result.token);
                    setToken(statusRes.result.token)
                    setUser(jwtDecode(statusRes.result.token))
                    localStorage.setItem("user", JSON.stringify(jwtDecode(statusRes.result.token)));

                    console.log(token)
                    navigate("/");

                } else {
                    alert("Wrong username or password");
                    throw new Error("Wrong username or password");
                }

            } else {
                alert("Wrong username or password");
                throw new Error(res.message || "Login failed");
            }

        } catch (err) {
            console.log("Error:", err);
        }
    };


    const logOut = () => {
        setUser(null);
        setToken("");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login")
    }


    return <AuthContext.Provider value={{ token, user, loginAction, logOut }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};