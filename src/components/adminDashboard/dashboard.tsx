/**
 * Author:
 * - Hussein Dirani s223518
 * - Raihanullah Mehran s233837
 *
 * Description:
 * Dashboard Page
 */
import { Tab, Table } from "@mui/material";
import { useAuth } from "../../auth/authProvider";
import TableUsers from "./tableUser";
import { TopBar } from "../OverviewPage/TopBar";

export default function Dashboard() {
  const auth = useAuth();
  return (
    <div className="w-full h-screen text-start">
      <TopBar />
      <div className="py-4 px-10">
        <h1 className="text-white mt-2">Dashboard</h1>
        <TableUsers />
      </div>
    </div>
  );
}
