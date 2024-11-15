import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setActivePipeline } from "../../redux/slices/pipelineSlice";
import PipelineActionMenu from "./Pipelines/PipelineActionMenu";
import { handleDeletePipeline } from "./Pipelines/utils/PipelineActions";
import { handleUpdatePipeline } from "./Pipelines/utils/PipelineActions";
import ConfirmDeleteDialog from "./Pipelines/ConfirmDeleteDialog";

export interface PipelineCardProps {
  id: string;
  name: string;
  orgId: string;
  repoId: string;
  imgData: string;
  onDelete: (id: string) => void;
}

export default function MediaCard({
  id,
  name,
  orgId,
  repoId,
  imgData,
  onDelete,
}: PipelineCardProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);

  const handleOpenDialog = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleConfirmDelete = () => {
    handleDeletePipeline(id, name, orgId, repoId);
    onDelete(id);
    setOpenConfirmDialog(false);
  };

  const handleUpdateClick = () => {
    handleUpdatePipeline(id, name, orgId, repoId);
  };

  // Navigate to pipeline editing mode
  const navigateToPipeline = () => {
    dispatch(setActivePipeline(id));
    navigate("/pipeline");
  };

  return (
    <>
      <Card
        sx={{
          maxWidth: 345,
          position: "relative",
        }}
      >
        <CardActionArea onClick={navigateToPipeline}>
          <CardMedia sx={{ height: 140 }} title="Pipeline" image={imgData} />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Click this to modify the pipeline
            </Typography>
          </CardContent>
        </CardActionArea>

        {/* Use the new PipelineActionMenu component */}
        <PipelineActionMenu
          onDeleteClick={handleOpenDialog}
          onUpdateClick={handleUpdateClick}
        />
      </Card>
      {/* Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={openConfirmDialog}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        itemName={name}
      />
    </>
  );
}
