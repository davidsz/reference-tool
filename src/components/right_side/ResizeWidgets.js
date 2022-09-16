import { useContext } from "react";
import { WorkspaceContext } from "../..";
import RightSideWidget from "./RightSideWidget";
import { Stack, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function ResizeWidgets() {
    const workspaceEngine = useContext(WorkspaceContext);

    return (
        <>
            <RightSideWidget
                name="Resize image"
                description="You can specify the desired aspect ratio."
                action={{ name: "Resize", callback: () => {} }}
            >
                <Stack spacing={2} direction="row" sx={{ mt: 3 }} alignItems="center">
                    <TextField label="Width" variant="outlined" />
                    <CloseIcon />
                    <TextField label="Height" variant="outlined" />
                </Stack>
            </RightSideWidget>
            <RightSideWidget
                description="Size corrections are not permanent. Here you can restore the image to its original size."
                action={{ name: "Restore", callback: () => {} }}
            ></RightSideWidget>
        </>
    );
}

export default ResizeWidgets;
