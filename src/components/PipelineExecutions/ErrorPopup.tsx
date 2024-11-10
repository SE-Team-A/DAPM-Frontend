import { Dialog, DialogTitle } from '@mui/material';
import React from 'react'

type Props = {
    open: boolean;
    exId: string;
    error: string;
    onClose: () => void;
}

function ErrorPopup(props: Props) {
    const { onClose, exId, error, open } = props;
  
    const handleClose = () => {
      onClose();
    };
  
    return (
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Error log for execution: {exId}</DialogTitle>
        <div className='px-4 py-4'>
            <p>{error}</p>
        </div>
      </Dialog>
    );
  }

export default ErrorPopup