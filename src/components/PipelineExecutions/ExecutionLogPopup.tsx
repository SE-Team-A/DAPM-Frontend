/**
 * Author:
 * - Tamas Drabos
 */

import { Dialog, DialogTitle } from '@mui/material';
import React from 'react'

type Props = {
    open: boolean;
    exId: string;
    log: string;
    onClose: () => void;
}

function ExecutionLogPopup(props: Props) {
    const { onClose, exId, log, open } = props;
  
    const handleClose = () => {
      onClose();
    };
  
    return (
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Execution logs: {exId}</DialogTitle>
        <p>{log}</p>
      </Dialog>
    );
  }

export default ExecutionLogPopup