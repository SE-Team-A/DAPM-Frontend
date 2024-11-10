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

export default function BasicSidebar() {
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
      <LogoutButton />
    </Drawer>
  );
}
