/**
 * Author:
 * - Mahdi Dirani
 * 
 * Description:
 * Login Page
 */
import { Box } from "@mui/material";
import { useAuth } from "../auth/authProvider";
import AdminDashboardDrawerLeft from "../components/adminDashboard/adminSidebar";

export default function Dashboard() {
    const user=useAuth();
    console.log("I am token:", user)
    console.log(user?.user?.isAdmin)
    return (
        <div>
            <Box sx={{display: 'flex'}}>
                <AdminDashboardDrawerLeft />
                <div className="w-full h-screen text-start p-5">
                    <h1 className="text-white text-3xl font-bold">Users</h1>
                    <h1 className="text-white mt-2">15 Users</h1>

                    <div className="bg-[#292929] mt-10 flex justify-between rounded-xl border-2 border-white text-white px-4 py-2">
                        <h2 className="">Username</h2>
                        <h2 className="">Name</h2>
                        <h2 className="">Role</h2>
                    </div>

                    <div className=" mt-5 flex justify-between rounded-xl border-2 border-white text-white px-4 py-2">
                        <h2 className="">Username</h2>
                        <h2 className="">Name</h2>
                        <h2 className="">Role</h2>
                    </div>

                </div>
            </Box>
        </div>
    )
}