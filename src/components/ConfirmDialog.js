import { useId } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function ConfirmDialog({ open, title, onAccept, onReject, onClose, children }) {
    const id = useId();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby={`alert-dialog-${id}-title`}
            aria-describedby={`alert-dialog-${id}-description`}>
            <DialogTitle id={`alert-dialog-${id}-title`}>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id={`alert-dialog-${id}-description`}>{children}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        onReject();
                        onClose();
                    }}>
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        onAccept();
                        onClose();
                    }}
                    autoFocus>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmDialog;
