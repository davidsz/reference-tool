import { useContext, useState } from "react";
import { WorkspaceContext } from "../..";
import RightSideWidget from "./RightSideWidget";
import { Stack, TextField, Switch, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function ResizeWidgets() {
    const workspaceEngine = useContext(WorkspaceContext);
    let ar = workspaceEngine.getResizeAspectRatio();
    const [aspectWidth, setAspectWidth] = useState(ar.width);
    const [aspectHeight, setAspectHeight] = useState(ar.height);
    const [keepAspectRatio, setKeepAspectRatio] = useState(workspaceEngine.keep_aspect_ratio_);

    return (
        <>
            <RightSideWidget
                name="Resize image"
                description=""
                action={{ name: "Resize to selection", callback: () => workspaceEngine.cropImage() }}
            >
                <Stack spacing={2} direction="row" alignItems="center">
                    <Typography>Free mode</Typography>
                    <Switch
                        checked={keepAspectRatio}
                        onChange={(e) => {
                            workspaceEngine.keep_aspect_ratio_ = e.target.checked;
                            setKeepAspectRatio(e.target.checked);
                        }}
                    />
                    <Typography>Keep aspect ratio</Typography>
                </Stack>
            </RightSideWidget>
            {keepAspectRatio && (
                <RightSideWidget
                    name="Aspect ratio"
                    description="You can specify the desired aspect ratio. The initial selection will cover as large area as possible."
                >
                    <Stack spacing={2} direction="row" sx={{ mt: 3 }} alignItems="center">
                        <TextField
                            label="Width"
                            variant="outlined"
                            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                            value={aspectWidth}
                            onChange={(e) => {
                                let w = parseInt(!e.target.value || e.target.value === "0" ? 1 : e.target.value);
                                setAspectWidth(w);
                                workspaceEngine.setResizeAspectRatio(w, aspectHeight);
                            }}
                        />
                        <CloseIcon />
                        <TextField
                            label="Height"
                            variant="outlined"
                            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                            value={aspectHeight}
                            onChange={(e) => {
                                let h = parseInt(!e.target.value || e.target.value === "0" ? 1 : e.target.value);
                                setAspectHeight(h);
                                workspaceEngine.setResizeAspectRatio(aspectWidth, h);
                            }}
                        />
                    </Stack>
                </RightSideWidget>
            )}
            <RightSideWidget
                description="Size corrections are not permanent. Here you can restore the image to its original size."
                action={{ name: "Restore", callback: () => {
                    setAspectWidth(1);
                    setAspectHeight(1);
                    workspaceEngine.resetCrop();
                } }}
            ></RightSideWidget>
        </>
    );
}

export default ResizeWidgets;
