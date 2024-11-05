/**
 * Authors:
 * - Mahdi El Dirani 
 * - Hussein Dirani
 * 
 * Description:
 * This component manages authentication state, including login and signup actions, 
 * using React Context API. It handles user information, JWT token storage, 
 * and user session management. 
 */

import { useContext, createContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface User {
    id: string;
    username: string;
    role: string;
}

interface UserContextType {
    // user:  User| null;
    // token: string;
    // loadingLogin: boolean;
    // loadingRegister: boolean;
    // loginAction: (data: { username: string; password: string }) => Promise<void>;
    // signupAction: (data: { username: string; password: string; name:string; role:string }) => Promise<unknown>;
    // logOut: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider = ({ children }: { children: ReactNode }) => {
    const [users, setUsers] = useState<User[]>([]);
    

    const token = localStorage.getItem("token") || "";
    const deleteUser = async (data: { id: string }) => {
        console.log(token)

        try {
            const response = await fetch("http://localhost:5281/authentication/registration", {
                method: "Delete",
                // mode: 'no-cors', 
                headers: {
                    "Content-Type": "application/json",

                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            const res = await response.json();


            if (res) {

                const ticketId = res.ticketId;
                // setLoadingRegister(true)
                await new Promise((resolve) => setTimeout(resolve, 2000));
                // setLoadingRegister(false)
                const statusResponse = await fetch(`http://localhost:5281/status/${ticketId}`, {
                    method: "GET",
                    // mode: 'no-cors', 
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const statusRes = await statusResponse.json();
                setUsers(users.filter(u => u.id !== data.id));
                return statusRes


            } else {
                // alert("Wrong username or password");
                throw new Error(res.message || "Registration failed");
            }

        } catch (err) {
            console.log("Error:", err);
            return err;
        }

    }

    
    const getUsers = async () => {
        try {
            const response = await fetch("http://localhost:5281/authentication/registration", {
                method: "GET",
                // mode: 'no-cors', 
                headers: {
                    "Content-Type": "application/json",

                    "Authorization": `Bearer ${token}`,
                }
            });
            const res = await response.json();
            if (res) {
                const ticketId = res.ticketId;
                // setLoadingRegister(true)
                await new Promise((resolve) => setTimeout(resolve, 2000));
                // setLoadingRegister(false)
                const statusResponse = await fetch(`http://localhost:5281/status/${ticketId}`, {
                    method: "GET",
                    // mode: 'no-cors', 
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                
                const statusRes = await statusResponse.json();
                //this need to be updated
                setUsers(statusRes.result.users);

                return statusRes


            } else {
                throw new Error(res.message || "Get User Failed");
            }
        } catch (err) {
            console.log("Error:", err);
            return err;
        }
    }

    return <UserContext.Provider value={{getUsers,users,deleteUser}}>{children}</UserContext.Provider>;
};

export default UserProvider;

export const useUsers = () => {
    return useContext(UserContext);
};