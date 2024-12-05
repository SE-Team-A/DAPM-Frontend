/**
 * Author:
 * - Raihanullah Mehran
 */
import React from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface FileInputProps {
  label: string;
  fileName: string | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileRemove: () => void;
  error?: string | null;
}

const FileInput: React.FC<FileInputProps> = ({
  label,
  fileName,
  onFileChange,
  onFileRemove,
  error,
}) => {
  return (
    <Box sx={{ marginBottom: "16px" }}>
      <Typography sx={{ marginBottom: "8px" }}>{label}</Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          border: "1px dashed gray",
          borderRadius: "4px",
          padding: "10px",
          backgroundColor: "#f0f0f0",
        }}
      >
        <label htmlFor={`${label}-file-input`}>
          <input
            style={{ display: "none" }}
            type="file"
            id={`${label}-file-input`}
            onChange={onFileChange}
          />
          <Button
            variant="outlined"
            component="span"
            sx={{
              backgroundColor: "white",
              color: "gray",
              borderColor: "gray",
              "&:hover": { backgroundColor: "lightgray" },
            }}
          >
            Choose File
          </Button>
        </label>
        <Typography
          variant="body2"
          sx={{ color: "gray", marginLeft: "10px", flex: 1 }}
        >
          {fileName || "No file chosen"}
        </Typography>
        {fileName && (
          <IconButton onClick={onFileRemove} sx={{ color: "gray" }}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      {error && (
        <Typography variant="body2" color="error" sx={{ marginTop: "8px" }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default FileInput;
