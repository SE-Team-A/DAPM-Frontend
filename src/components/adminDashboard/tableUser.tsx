import { SetStateAction, useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { useUsers } from "../../auth/usersProvider";
export default function TableUsers() {

    const [currentPage, setCurrentPage] = useState(1);
    const [currentUsers, setCurrentUsers] = useState<{ username: string; role: string }[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const user=useUsers();

    const users = [
        {
            username: "user1",
            role: "admin"
        },
        {
            username: "user2",
            role: "user"
        },
        {
            username: "user3",
            role: "admin"
        },
        {
            username: "user4",
            role: "user"
        },
        {
            username: "user5",
            role: "admin"
        },
        {
            username: "user6",
            role: "user"
        },
        {
            username: "user7",
            role: "admin"
        },
        {
            username: "user8",
            role: "user"
        },
        {
            username: "user9",
            role: "admin"
        },
        {
            username: "user10",
            role: "user"
        },
        {
            username: "user11",
            role: "admin"
        },
        {
            username: "user12",
            role: "user"
        },
        {
            username: "user13",
            role: "admin"
        },
        {
            username: "user14",
            role: "user"
        },
        {
            username: "user15",
            role: "superadmin"
        },

    ]
    const usersPerPage = 5;


    useEffect(() => {
        if (users) {
            // Calculate the indices for slicing the tasks array
            const indexOfLastEvent = currentPage * usersPerPage;
            const indexOfFirstEvent = indexOfLastEvent - usersPerPage;
            const currentUsers = users.slice(indexOfFirstEvent, indexOfLastEvent);
            //set the currentUsers in the currentUsers state
            setCurrentUsers(currentUsers);
            // Calculate total pages
            const totalPages = Math.ceil(users.length / usersPerPage);
            setTotalPages(totalPages)
        }
        // console.log(tasks, "table")
    }, [users, currentPage])



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
                            <div className="table-row-item w-1/3">{user.username}</div>
                            <div className="table-row-item w-1/3">
                            <select
                                className="p-0 cursor-pointer select priority-select  bg-transparent border-none focus:border-none text-white"
                                name="role"
                                value={user.role}
                                aria-label="Project status">
                                <option className="bg-black" value="user">User</option>
                                <option className="bg-black" value="admin">Admin</option>
                                <option className="bg-black" value="guest">Guest</option>
                                <option className="bg-black" value="superadmin">Super Admin</option>
                            </select>
                            </div>
                            <div className="table-row-item w-1/3 ">
                            {
                                user.role === "superadmin" ? (
                                    <div className="text-red-500">Super Admin</div>
                                ) : (
                                    <DeleteIcon className="cursor-pointer hover:text-red-500"/>
                                )
                            }
                            </div>
                        </div>
                    )) : (
                        <div className="table-row  w-full">
                            <div className="table-row-item w-full text-center">No users</div>
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