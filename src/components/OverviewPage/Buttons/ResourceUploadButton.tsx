import React, { useState } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import ResourceForm from "../Resources/ResourceForm";

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
};

const ResourceUploadButton: React.FC<UploadButtonProps> = ({
  orgId,
  repId,
}) => {
  const [open, setOpen] = useState(false);

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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-create-repository"
        aria-describedby="modal-create-repository"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ color: "white" }}
          >
            Upload Resource
          </Typography>
          <ResourceForm orgId={orgId} repId={repId} closeModal={handleClose} />
        </Box>
      </Modal>
    </div>
  );
};

export default ResourceUploadButton;
