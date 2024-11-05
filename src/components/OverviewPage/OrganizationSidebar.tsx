// PersistentDrawerLeft.js

import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { getOrganizations, getRepositories, getResources } from '../../redux/selectors/apiSelector';
import { organizationThunk, repositoryThunk, resourceThunk } from '../../redux/slices/apiSlice';
import { Organization, Repository, Resource } from '../../redux/states/apiState';
import { useAppDispatch, useAppSelector } from '../../hooks';
import ResourceUploadButton from './Buttons/ResourceUploadButton';
import CreateRepositoryButton from './Buttons/CreateRepositoryButton';
import AddOrganizationButton from './Buttons/AddOrganizationButton';
import OperatorUploadButton from './Buttons/OperatorUploadButton';
import AddMemberButton from "../createUser/addMemberButton";
import { LogoutButton } from "../logout/logoutButton";
import { useAuth } from "../../auth/authProvider";
import { deleteResource, downloadResource } from '../../services/backendAPI';

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function PersistentDrawerLeft() {
  const dispatch = useAppDispatch();
  const organizations: Organization[] = useAppSelector(getOrganizations);
  const repositories: Repository[] = useAppSelector(getRepositories);
  const resources = useSelector(getResources);
  const auth = useAuth();

  useEffect(() => {
    dispatch(organizationThunk());
    dispatch(repositoryThunk(organizations));
    dispatch(resourceThunk({ organizations, repositories }));
  }, [dispatch, organizations, repositories]);

  const handleDelete = async (resource: Resource) => {
    console.log('Deleting resource:', resource);
    await deleteResource(resource.organizationId, resource.repositoryId, resource.id);
  };

  const handleDownload = async (resource: Resource) => {
    const response = await downloadResource(resource.organizationId, resource.repositoryId, resource.id);
    await downloadReadableStream(response.url, resource.name);
  };

  async function downloadReadableStream(url: string, fileName: string) {
    window.open(url, "_blank");
  }

  return (
    <Drawer
      PaperProps={{
        sx: {
          backgroundColor: "#292929",
          zIndex: 10,
          overflowX: 'hidden', // Prevent horizontal scrolling
        },
      }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          overflowX: 'hidden', // Prevent horizontal scrolling in drawer paper
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Divider />
      {auth?.user?.isAdmin === "true" && (
        <DrawerHeader>
          <Typography sx={{ width: "100%", textAlign: "center" }} variant="h6" noWrap>
            Add Member
          </Typography>
          <AddMemberButton />
        </DrawerHeader>
      )}
      <DrawerHeader>
        <Typography sx={{ width: "100%", textAlign: "center" }} variant="h6" noWrap>
          Organisations
        </Typography>
        <AddOrganizationButton />
      </DrawerHeader>
      <List>
        {organizations.map((organization) => (
          <React.Fragment key={organization.id}>
            <ListItem sx={{ justifyContent: "center" }} disablePadding>
              <Typography variant="h6">{organization.name}</Typography>
            </ListItem>
            {repositories
              .filter((repo) => repo.organizationId === organization.id)
              .map((repository) => (
                <React.Fragment key={repository.id}>
                  <ListItem sx={{ paddingInline: "5px" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {repository.name}
                    </Typography>
                  </ListItem>
                  <div style={{ display: "flex", alignItems: "center", paddingInline: "0.5rem" }}>
                    <Typography variant="caption">Resources</Typography>
                    <Box sx={{ marginLeft: "auto" }}>
                      <ResourceUploadButton orgId={repository.organizationId} repId={repository.id} />
                    </Box>
                  </div>
                  {resources
                    .filter((resource) => resource.repositoryId === repository.id && resource.type !== "operator")
                    .map((resource) => (
                      <ListItem key={resource.id} disablePadding>
                        <ListItemButton onClick={() => handleDownload(resource)}>
                          <ListItemText
                            primary={resource.name}
                            primaryTypographyProps={{ fontSize: "0.8rem" }}
                          />
                        </ListItemButton>
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(resource)}>
                          <DeleteIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </ListItem>
                    ))}
                  <div style={{ display: "flex", alignItems: "center", paddingInline: "0.5rem" }}>
                    <Typography variant="caption">Operators</Typography>
                    <Box sx={{ marginLeft: "auto" }}>
                      <OperatorUploadButton orgId={repository.organizationId} repId={repository.id} />
                    </Box>
                  </div>
                  {resources
                    .filter((resource) => resource.repositoryId === repository.id && resource.type === "operator")
                    .map((resource) => (
                      <ListItem key={resource.id} disablePadding>
                        <ListItemButton>
                          <ListItemText
                            primary={resource.name}
                            primaryTypographyProps={{ fontSize: "0.8rem" }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                </React.Fragment>
              ))}
            <ListItem sx={{ justifyContent: "center" }}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <CreateRepositoryButton orgId={organization.id} />
              </Box>
            </ListItem>
          </React.Fragment>
        ))}
      </List>
      <LogoutButton />
    </Drawer>
  );
}
