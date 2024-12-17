/**
 * Author:
 * - Ayat Al Rifai
 */
import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getOrganizations, getRepositories, getResources } from '../../redux/selectors/apiSelector';
import { organizationThunk, repositoryThunk, resourceThunk } from '../../redux/slices/apiSlice';
import { Organization, Repository, Resource } from '../../redux/states/apiState';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Box, Button, IconButton, Snackbar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import ResourceUploadButton from './Buttons/ResourceUploadButton';
import { deleteResource, downloadResource } from '../../services/backendAPI';
import CreateRepositoryButton from './Buttons/CreateRepositoryButton';
import AddOrganizationButton from './Buttons/AddOrganizationButton';
import OperatorUploadButton from './Buttons/OperatorUploadButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { LogoutButton } from "../logout/logoutButton";
import { useAuth } from "../../auth/authProvider";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HomePage } from "./HomePage";

const drawerWidth = 240;
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  justifyContent: "flex-end",
}));

export default function PersistentDrawerLeft() {
  const dispatch = useAppDispatch();
  const organizations: Organization[] = useAppSelector(getOrganizations);
  const repositories: Repository[] = useAppSelector(getRepositories);
  const resources = useSelector(getResources);
  const auth = useAuth();
  const navigate = useNavigate();
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(null);

  useEffect(() => {
      dispatch(organizationThunk());
  }, []);

  useEffect(() => {
    dispatch(repositoryThunk(organizations));
  }, [organizations]);

  useEffect(() => {
    dispatch(resourceThunk({ organizations, repositories }));
  }, [repositories]);

  const handleDelete = async (resource: Resource) => {
    setResourceToDelete(resource);
    setConfirmDelete(true); // Show confirmation dialog
  };

  const handleDeleteConfirm = async () => {
    if (resourceToDelete) {
      await deleteResource(
        resourceToDelete.organizationId,
        resourceToDelete.repositoryId,
        resourceToDelete.id
      );
      setDeleteAlertOpen(true); // Show Snackbar
      setConfirmDelete(false);  // Close dialog
      setTimeout(() => setDeleteAlertOpen(false), 20000); // Close Snackbar after 20 seconds
    }
  };

  const handleDeleteCancel = () => {
    setConfirmDelete(false); // Close dialog without deleting
    setResourceToDelete(null);
  };

  const handleDownload = async (resource: Resource) => {
    const response = await downloadResource(
      resource.organizationId,
      resource.repositoryId,
      resource.id
    );
    await downloadReadableStream(response.url, resource.name);
  };

  async function downloadReadableStream(url: string, fileName: string) {
    const response = await fetch(url);
    const blob = await response.blob(); // Get the file data as a Blob
    const fileUrl = URL.createObjectURL(blob); // Create a temporary object URL
  
    // Trigger file download
    const anchor = document.createElement("a");
    anchor.href = fileUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  
    // Clean up the object URL after use
    URL.revokeObjectURL(fileUrl);
  }
  

  return (
    <>
      <Drawer
        PaperProps={{
          sx: {
            backgroundColor: "#292929",
            zIndex: 10,
            overflowX: "hidden",
          },
        }}
        sx={{
          width: drawerWidth,
          position: "static",
          flexGrow: 1,
          overflowX: "hidden",
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            overflowX: "hidden",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Divider />
        <HomePage />
        {
          (auth?.user?.role === "Admin" || auth?.user?.role === "SuperAdmin") &&
          <DrawerHeader>
            <Typography
              sx={{ width: "100%", textAlign: "center" }}
              variant="h6"
              noWrap
              component="div"
            >
              Dashboard
            </Typography>
            <Button onClick={() => { navigate("/admin-dashboard") }} sx={{ backgroundColor: "gray", padding: "1px", color: "black" }} >{">"}</Button>
          </DrawerHeader>
        }

        <DrawerHeader>
          <Typography
            sx={{ width: "100%", textAlign: "center" }}
            variant="h6"
            noWrap
            component="div"
          >
            Organisations
          </Typography>
          <AddOrganizationButton />
        </DrawerHeader>

        <List>
          {organizations.map((organization) => (
            <>
              <ListItem
                sx={{ justifyContent: "center" }}
                key={organization.id}
                disablePadding
              >
                <p style={{ marginBlock: "0rem", fontSize: "25px" }}>
                  {organization.name}
                </p>
              </ListItem>
              {repositories.map((repository) =>
                repository.organizationId === organization.id ? (
                  <>
                    <ListItem key={repository.id} sx={{ paddingInline: "5px" }}>
                      <p
                        style={{
                          padding: "0",
                          fontSize: "25px",
                          marginBlock: "10px",
                        }}
                      >
                        {repository.name}
                      </p>
                    </ListItem>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        paddingInline: "0.5rem",
                      }}
                    >
                      <p style={{ fontSize: "0.9rem" }}>Resources</p>
                      <Box sx={{ marginLeft: "auto" }}>
                        <ResourceUploadButton
                          orgId={repository.organizationId}
                          repId={repository.id}
                        />
                      </Box>
                    </div>
                    {resources.map((resource) =>
                      resource.repositoryId === repository.id &&
                      resource.type !== "operator" ? (
                        <ListItem key={resource.id} disablePadding>
                          <ListItemButton
                            sx={{ paddingBlock: 0 }}
                            onClick={(_) => handleDownload(resource)}
                          >
                            <ListItemText
                              secondary={resource.name}
                              secondaryTypographyProps={{ fontSize: "0.8rem" }}
                            />
                          </ListItemButton>
                          <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(resource)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItem>
                      ) : (
                        ""
                      )
                    )}

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        paddingInline: "0.5rem",
                      }}
                    >
                      <p style={{ fontSize: "0.9rem" }}>Operators</p>
                      <Box sx={{ marginLeft: "auto" }}>
                        <OperatorUploadButton
                          orgId={repository.organizationId}
                          repId={repository.id}
                        />
                      </Box>
                    </div>
                    {resources.map((resource) =>
                      resource.repositoryId === repository.id &&
                      resource.type === "operator" ? (
                        <ListItem key={resource.id} disablePadding>
                          <ListItemButton sx={{ paddingBlock: 0 }}>
                            <ListItemText
                              secondary={resource.name}
                              secondaryTypographyProps={{ fontSize: "0.8rem" }}
                            />
                          </ListItemButton>
                        </ListItem>
                      ) : (
                        ""
                      )
                    )}
                  </>
                ) : (
                  ""
                )
              )}
              <ListItem sx={{ justifyContent: "center" }}>
                <Box
                  sx={{
                    width: "auto",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CreateRepositoryButton orgId={organization.id} />
                </Box>
              </ListItem>
            </>
          ))}
        </List>
        <LogoutButton />
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDelete}
        onClose={handleDeleteCancel}
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-description"
      >
        <DialogTitle id="confirm-delete-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-delete-description">
            Are you sure you want to delete this resource? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for delete confirmation */}
      <Snackbar
        open={deleteAlertOpen}
        message="Resource is getting deleted... Reload the page"
        onClose={() => setDeleteAlertOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={20000}
      />
    </>
  );
}
