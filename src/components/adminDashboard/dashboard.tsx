import { Tab, Table } from "@mui/material";
import { useAuth } from "../../auth/authProvider";
import TableUsers from "./tableUser";

export default function Dashboard() {

    const auth = useAuth();
    return (
        <div className="w-full h-screen text-start p-5">
            <h1 className="text-white text-3xl font-bold">Users</h1>
            <h1 className="text-white mt-2">15 Users</h1>
            <TableUsers />
        </div>
    );
}