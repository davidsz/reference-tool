import { useState } from "react";
import { Button, Typography, Stack } from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

function FileInput({ onChange }) {
    const [attachment, setAttachment] = useState();

    function handleChange(event) {
        const files = Array.from(event.target.files);
        const [file] = files;
        setAttachment(file);
        if (!!onChange) onChange(file);
    }

    return (
        <Button component="label" color="inherit" sx={{ mt: 3 }}>
            <Stack spacing={2} direction="row" alignItems="center">
                <InsertDriveFileIcon color="inherit" />
                <Typography noWrap>{attachment?.name || "Select file"}</Typography>
                <input type="file" hidden onChange={handleChange} />
            </Stack>
        </Button>
    );
}

export default FileInput;
