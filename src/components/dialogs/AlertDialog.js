import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogBase from "./DialogBase";

function AlertDialog({ open, title, onAccept, onClose, children }) {
    return (
        <DialogBase open={open} title={title} onClose={onClose}>
            <DialogContent dividers>
                <DialogContentText>{children}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        onAccept();
                        onClose();
                    }}
                    autoFocus>
                    OK
                </Button>
            </DialogActions>
        </DialogBase>
    );
}

export default AlertDialog;
