/**
 * Author:
 * - Mahdi El Dirani s233031
 * - Hussein Dirani s223518
 * - Raihanullah Mehran s233837
 *
 * Description:
 * Sidebar Page
 */
import { styled } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import AddMemberButton from "../createUser/addMemberButton";
import { LogoutButton } from "../logout/logoutButton";
import { useAuth } from "../../auth/authProvider";
import { HomePage } from "../OverviewPage/HomePage";

const drawerWidth = 240;
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function AdminDashboardDrawerLeft() {
  const auth = useAuth();
  return (
    <Drawer
      PaperProps={{
        sx: {
          backgroundColor: "#292929",
          zIndex: 10,
        },
      }}
      sx={{
        width: drawerWidth,
        position: "static",
        flexGrow: 1,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Divider />
      <HomePage />
      <Divider />
      {(auth?.user?.role === "Admin" || "SuperAdmin") && (
        <DrawerHeader>
          <Typography
            sx={{ width: "100%", textAlign: "center" }}
            variant="h6"
            noWrap
            component="div"
          >
            Add Member
          </Typography>
          <AddMemberButton />
        </DrawerHeader>
      )}
      <LogoutButton />
    </Drawer>
  );
}
