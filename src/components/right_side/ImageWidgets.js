import { useContext, useState } from "react";
import { WorkspaceContext } from "../..";
import FileInput from "../FileInput";
import RightSideWidget from "./RightSideWidget";
import { Stack, TextField } from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";

function ImageWidgets() {
    const workspaceEngine = useContext(WorkspaceContext);
    const [file, setFile] = useState();
    const [url, setUrl] = useState();

    return (
        <>
            <RightSideWidget
                name="Using local image"
                description="Select image file from your device."
                action={{
                    name: "Load",
                    callback: () => {
                        workspaceEngine.loadLocalImage(file);
                    },
                }}
            >
                <FileInput onChange={(f) => setFile(f)} />
            </RightSideWidget>
            <RightSideWidget
                name="Image from URL"
                description="Load image from network using a HTTP/HTTPS address."
                action={{ name: "Load", callback: () => workspaceEngine.loadImageURL(url) }}
            >
                <Stack spacing={2} direction="row" sx={{ mt: 3 }} alignItems="center">
                    <PublicIcon />
                    <TextField
                        label="URL"
                        onChange={(e) => setUrl(e.target.value)}
                        variant="outlined"
                        sx={{ flexGrow: 1 }}
                    />
                </Stack>
            </RightSideWidget>
        </>
    );
}

export default ImageWidgets;
