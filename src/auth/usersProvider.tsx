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
    signupAction: (data: { username: string; password: string; name:string; role:string }) => Promise<unknown>;
    loadingRegister: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider = ({ children }: { children: ReactNode }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loadingRegister, setLoadingRegister] = useState(false);

    

    const token = localStorage.getItem("token") || "";
    const deleteUser = async (data: { id: string }) => {
        console.log(data.id)

        setUsers((prev) => prev.filter((user) => user.id !== data.id));
        try {

            const response = await fetch(process.env.REACT_APP_API_URL + `/authentication/users/${data.id}`, {
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
                const statusResponse = await fetch(process.env.REACT_APP_API_URL + `/status/${ticketId}`, {
                    method: "GET",
                    // mode: 'no-cors', 
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const statusRes = await statusResponse.json();
                console.log(statusRes)

                return statusRes


            } else {
                alert("something went wrong");
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

            const response = await fetch(process.env.REACT_APP_API_URL + `/authentication/users/${data.id}/role/${data.role}`, {
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
                const statusResponse = await fetch(process.env.REACT_APP_API_URL + `/status/${ticketId}`, {
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
            const response = await fetch(process.env.REACT_APP_API_URL + "/authentication/users", {
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
                const statusResponse = await fetch(process.env.REACT_APP_API_URL + `/status/${ticketId}`, {
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

    const signupAction = async (data: { username: string; password: string; name:string; role:string }) => {
        console.log(token)
        
        
        try {
            
            const response = await fetch(process.env.REACT_APP_API_URL + "/authentication/registration", {
                method: "POST",
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
                setLoadingRegister(true)
                await new Promise((resolve) => setTimeout(resolve, 2000));
                setLoadingRegister(false)
                const statusResponse = await fetch(process.env.REACT_APP_API_URL + `/status/${ticketId}`, {
                    method: "GET",
                    // mode: 'no-cors', 
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const statusRes = await statusResponse.json();
                // console.log(statusRes)
                getUsers();
                return statusRes

                // // Check if the status retrieval succeeded
                // if (statusRes.result.succeeded) {


                // } else {
                //     alert("Wrong username or password");
                //     throw new Error("Wrong username or password");
                // }

            } else {
                // alert("Wrong username or password");
                throw new Error(res.message || "Registration failed");
            }

        } catch (err) {
            console.log("Error:", err);
            return err;
        }

    }

    return <UserContext.Provider value={{loadingRegister,getUsers,users,deleteUser,setUsers,updateUser,signupAction}}>{children}</UserContext.Provider>;
};

export default UserProvider;

export const useUsers = () => {
    return useContext(UserContext);
};