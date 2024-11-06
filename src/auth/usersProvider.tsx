/**
 * Authors:
 * - Mahdi El Dirani s233031
 * - Hussein Dirani  s223518
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
    userName: string;
    role: string;
}

interface UserContextType {
    getUsers: () => Promise<unknown>;
    users: User[];
    deleteUser: (data: { id: string }) => Promise<unknown>;
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    updateUser: (data: { id: string; role:string }) => Promise<unknown>;
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

    const updateUser = async (data: { id: string; role:string }) => {
        try {
            setUsers(users.map(u => {
                if(u.id === data.id){
                    u.role = data.role
                }
                return u
            }))

            const response = await fetch(`http://localhost:5281/authentication/users/${data.id}/role/${data.role}`, {
                method: "Post",
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
                if(statusRes.result.succeeded){
                    setUsers(users.map(u => {
                        if(u.id === data.id){
                            u.role = data.role
                        }
                        return u
                    }))
                }


                return statusRes


            } else {
                throw new Error(res.message || "Get User Failed");
            }
        } catch (err) {
            console.log("Error:", err);
            return err;
        }
    }

    
    const getUsers = async () => {
        try {
            const response = await fetch("http://localhost:5281/authentication/users", {
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
                console.log("hahahhhahaha")
                console.log(statusRes)
                console.log("hahahhhahaha")
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

    return <UserContext.Provider value={{getUsers,users,deleteUser,setUsers,updateUser}}>{children}</UserContext.Provider>;
};

export default UserProvider;

export const useUsers = () => {
    return useContext(UserContext);
};