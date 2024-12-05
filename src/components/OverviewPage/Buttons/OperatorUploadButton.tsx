import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Typography,
  Modal,
  TextField,
} from "@mui/material";
import FileInput from "../Operators/FileInput";
import { useOperatorUpload } from "../Operators/useOperatorUpload";
import { useHandleOperatorSubmit } from "../Operators/useHandleOperatorSubmit";

export interface UploadButtonProps {
  orgId: string;
  repId: string;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  color: "white",
};

const OperatorUploadButton: React.FC<UploadButtonProps> = ({
  orgId,
  repId,
}) => {
  const [open, setOpen] = React.useState(false);

  const {
    selectedSourceFile,
    selectedDockerFile,
    fileError,
    handleFileChange,
    handleFileRemove,
    resetFileStates,
  } = useOperatorUpload();

  const { handleSubmit } = useHandleOperatorSubmit(
    orgId,
    repId,
    () => setOpen(false),
    selectedSourceFile,
    selectedDockerFile,
    resetFileStates
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button
        sx={{ backgroundColor: "gray", padding: "1px", color: "black" }}
        onClick={handleOpen}
      >
        +
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography
            variant="h6"
            component="h2"
            sx={{ textAlign: "center", mb: 2 }}
          >
            Upload Operator
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <FormLabel>Operator name</FormLabel>
              <TextField name="Name" />
              <FileInput
                label="Upload source code"
                fileName={selectedSourceFile?.name || null}
                onFileChange={(e) => handleFileChange(e, "source")}
                onFileRemove={() => handleFileRemove("source")}
              />
              <FileInput
                label="Upload Dockerfile"
                fileName={selectedDockerFile?.name || null}
                onFileChange={(e) => handleFileChange(e, "docker")}
                onFileRemove={() => handleFileRemove("docker")}
                error={fileError}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              sx={{
                backgroundColor: "gray",
                padding: "10px",
                color: "black",
                mt: 3,
              }}
              disabled={
                !selectedSourceFile || !selectedDockerFile || !!fileError
              }
            >
              Submit
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default OperatorUploadButton;
