import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogBase from "./DialogBase";

function ConfirmDialog({ open, title, onAccept, onReject, onClose, children }) {
    return (
        <DialogBase open={open} title={title} onClose={onClose}>
            <DialogContent>{children}</DialogContent>
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
        </DialogBase>
    );
}

export default ConfirmDialog;
