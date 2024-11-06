import { SetStateAction, useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { useUsers } from "../../auth/usersProvider";
import DeleteMemberPopup from "./deletePopup";
import { useAuth } from "../../auth/authProvider";
export default function TableUsers() {

    const [currentPage, setCurrentPage] = useState(1);
    const [currentUsers, setCurrentUsers] = useState<{ id: string; userName: string; role: string }[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [openDeleteMemberPopup, setOpenDeleteMemberPopup] = useState(false);
    const userProvider = useUsers();
    const auth = useAuth();


    useEffect(() => {

        const getUsers = async () => {
            try {
                const response = await fetch("http://localhost:5281/authentication/users", {
                    method: "GET",
                    // mode: 'no-cors', 
                    headers: {
                        "Content-Type": "application/json",

                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
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
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        },
                    });


                    const statusRes = await statusResponse.json();
                    console.log("hahahhhahaha")
                    console.log(statusRes)
                    console.log("hahahhhahaha")
                    //this need to be updated
                    userProvider?.setUsers(statusRes.result.users);
                    console.log(statusRes.result.users)

                    return statusRes


                } else {
                    throw new Error(res.message || "Get User Failed");
                }
            } catch (err) {
                console.log("Error:", err);
                return err;
            }
        }

        if (auth?.token) {
            getUsers();
        }

    }, [auth?.token])




    const usersPerPage = 5;


    useEffect(() => {
        if (userProvider?.users) {
            // Calculate the indices for slicing the tasks array
            const indexOfLastEvent = currentPage * usersPerPage;
            const indexOfFirstEvent = indexOfLastEvent - usersPerPage;
            const currentUsers = userProvider?.users.slice(indexOfFirstEvent, indexOfLastEvent);
            //set the currentUsers in the currentUsers state
            setCurrentUsers(currentUsers);
            // Calculate total pages
            const totalPages = Math.ceil(userProvider?.users.length / usersPerPage);
            setTotalPages(totalPages)
        }
        // console.log(tasks, "table")
    }, [userProvider?.users, currentPage])



    // Handle page change
    const handlePageChange = (pageNumber: SetStateAction<number>) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="mt-10">
            <div className="my-table flex flex-wrap w-full ">
                <div className="text-center text-white p-2 table-header flex w-full bg-[#292929] border-2 rounded border-white">
                    <div className="table-header-item w-1/3">Username</div>
                    <div className="table-header-item w-1/3">Role</div>
                    <div className="table-header-item w-1/3">Actions</div>
                </div>
                <div className="table-body w-full ">
                    {currentUsers.length ? currentUsers.map((user) => (
                        <div className="text-center text-white p-2 table-header flex w-full  table-tr rounded  mt-2 drop-shadow-2xl">
                            <div className="table-row-item w-1/3">{user.userName}</div>
                            <div className="table-row-item w-1/3">
                                <select
                                    className="p-0 cursor-pointer select priority-select  bg-transparent border-none focus:border-none text-white"
                                    name="role"
                                    disabled={auth?.user?.role === "Admin" && (user.role === "SuperAdmin" || user.role === "Admin")}
                                    value={user.role}
                                    onChange={(e) => {
                                        userProvider?.updateUser({ id: user.id, role: e.target.value });
                                    }}
                                    aria-label="Project status">
                                    <option disabled={auth?.user?.role !== "SuperAdmin"} className="bg-black" value="SuperAdmin">Super Admin</option>
                                    <option disabled={auth?.user?.role === "Admin" && user.role === "Admin"} className="bg-black" value="Admin">Admin</option>
                                    <option className="bg-black" value="User">User</option>
                                    <option className="bg-black" value="Guest">Guest</option>

                                </select>
                            </div>
                            <div className="table-row-item w-1/3 ">
                                {
                                    
                                    auth?.user?.role === "Admin" && (user.role === "SuperAdmin"|| user.role === "Admin") ? (
                                        <div className="text-red-500">No permission</div>
                                    ) : (
                                        
                                        <DeleteIcon onClick={() => { setOpenDeleteMemberPopup(true) }} className="cursor-pointer hover:text-red-500" />
                                    )
                                }
                          
                            </div>
                            <DeleteMemberPopup openDeleteMemberPopup={openDeleteMemberPopup} setOpenDeleteMemberPopup={setOpenDeleteMemberPopup}></DeleteMemberPopup>
                            {/* {   !(auth?.user?.role === "Admin" && (user.role === "Admin"||user.role === "SuperAdmin") )?
                                : <p className="text-red-400">No permission</p>
                            } */}
                        </div>
                    )) : (
                        <div className="table-row  w-full">
                            <div className="table-row-item w-full text-center">Loading...</div>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex justify-end mt-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-2 py-1 w-24 bg-green-600 rounded-xl text-white text-sm ${currentPage === 1 ? "bg-slate-400" : ""}`}>Previous</button>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-2 py-1 w-24 bg-green-600 rounded-xl text-white ml-2 text-sm ${currentPage === totalPages ? "bg-slate-400" : ""}`}>Next</button>
            </div>

        </div>
    );
}