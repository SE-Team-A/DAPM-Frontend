/**
 * Author:
 * - Mahdi Dirani
 * 
 * Description:
 * Dashboard Page
 */
import { Box } from "@mui/material";
import { useAuth } from "../auth/authProvider";
import AdminDashboardDrawerLeft from "../components/adminDashboard/adminSidebar";
import Dashboard from "../components/adminDashboard/dashboard";

export default function AdminDashboard() {
    const user=useAuth();
    console.log("I am token:", user)
    // console.log(user?.user?.role)
    return (
        <div>
            <Box sx={{display: 'flex'}}>
                <AdminDashboardDrawerLeft />
                <Dashboard/>
            </Box>
        </div>
    )
}