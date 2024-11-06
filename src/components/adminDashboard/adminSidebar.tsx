import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getOrganizations, getRepositories, getResources } from '../../redux/selectors/apiSelector';
import { organizationThunk, repositoryThunk, resourceThunk } from '../../redux/slices/apiSlice';
import { Organization, Repository, Resource } from '../../redux/states/apiState';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Box, IconButton } from '@mui/material';
import { deleteResource, downloadResource } from '../../services/backendAPI';
import DeleteIcon from '@mui/icons-material/Delete';
import AddMemberButton from "../createUser/addMemberButton";
import { LogoutButton } from "../logout/logoutButton";
import { useAuth } from "../../auth/authProvider";
import React from 'react';

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
      {
        (auth?.user?.role==="Admin"||"SuperAdmin") &&
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
      }




      <LogoutButton />
    </Drawer>
  );
}