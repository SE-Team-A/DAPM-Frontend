/**
 * Author:
 * - Raihanullah Mehran s233837
 *
 * Description:
 * Three dotted menu on each pipeline
 */

import * as React from "react";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

interface PipelineActionMenuProps {
  onDeleteClick: () => void;
  onUpdateClick: () => void;
}

const PipelineActionMenu: React.FC<PipelineActionMenuProps> = ({
  onDeleteClick,
  onUpdateClick,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {/* Three dots button */}
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleMenuOpen}
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <MoreVertIcon />
      </IconButton>

      {/* Menu that opens on three dots button click */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
            width: "20ch",
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onDeleteClick();
          }}
        >
          Delete
        </MenuItem>
        {/* <MenuItem
          onClick={() => {
            handleMenuClose();
            onUpdateClick();
          }}
        >
          Update
        </MenuItem> */}
      </Menu>
    </>
  );
};

export default PipelineActionMenu;
