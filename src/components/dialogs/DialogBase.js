import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";

function DialogBase({ open, title, onClose, children }) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            {children}
        </Dialog>
    );
}

export default DialogBase;
