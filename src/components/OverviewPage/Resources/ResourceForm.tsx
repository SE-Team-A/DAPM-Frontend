/**
 * Author:
 * - Raihanullah Mehran
 */
import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useResourceUpload } from "./useResourceUpload";

interface ResourceFormProps {
  orgId: string;
  repId: string;
  closeModal: () => void;
}

const ResourceForm: React.FC<ResourceFormProps> = ({ orgId, repId, closeModal }) => {
  const {
    selectedFileName,
    fileError,
    handleFileChange,
    handleFileRemove,
    handleSubmit,
  } = useResourceUpload(orgId, repId, closeModal);

  const dataTypes = ["eventLog", "bpmnModel", "petriNet"];

  return (
    <form onSubmit={handleSubmit}>
      <FormControl fullWidth margin="normal">
        <FormLabel>Resource name</FormLabel>
        <TextField name="Name" />

        <FormLabel className="mt-3">Resource type</FormLabel>
        <Select
          name="ResourceType"
          labelId="resourceType-select-lable"
          id="resourceType-select"
          sx={{ width: "100%" }}
        >
          {dataTypes.map((resource) => (
            <MenuItem key={resource} value={resource}>
              {resource}
            </MenuItem>
          ))}
        </Select>

        <FormLabel className="mt-4">Upload File</FormLabel>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: "1px dashed gray",
            borderRadius: "4px",
            padding: "10px",
            marginTop: "8px",
            backgroundColor: "#f0f0f0",
          }}
        >
          <label htmlFor="upload-file">
            <input
              style={{ display: "none" }}
              type="file"
              name="ResourceFile"
              id="upload-file"
              onChange={handleFileChange}
            />
            <Button
              variant="outlined"
              component="span"
              sx={{
                backgroundColor: "white",
                color: "gray",
                borderColor: "gray",
                "&:hover": {
                  backgroundColor: "lightgray",
                },
              }}
            >
              Choose File
            </Button>
          </label>
          <Typography
            variant="body2"
            sx={{ color: "gray", marginLeft: "10px", flex: 1 }}
          >
            {selectedFileName}
          </Typography>
          {selectedFileName !== "No file chosen" && (
            <IconButton onClick={handleFileRemove} sx={{ color: "gray" }}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>
        {fileError && (
          <Typography variant="body2" color="error" sx={{ marginTop: "8px" }}>
            {fileError}
          </Typography>
        )}
      </FormControl>

      <Button
        className="m-3 p-2"
        type="submit"
        fullWidth
        sx={{ backgroundColor: "gray", padding: "1px", color: "black" }}
        disabled={selectedFileName === "No file chosen" || fileError !== null}
      >
        Submit
      </Button>
    </form>
  );
};

export default ResourceForm;
