import { useContext, useState } from "react";
import { WorkspaceContext } from "../..";
import RightSideWidget from "./RightSideWidget";
import { Stack, TextField, Slider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContrastIcon from "@mui/icons-material/Contrast";

function GridWidgets() {
    const workspaceEngine = useContext(WorkspaceContext);
    const [autoGridSize, setAutoGridSize] = useState([0, 0]);
    const [virtualWidth, setVirtualWidth] = useState(workspaceEngine.virtual_width);
    const [virtualHeight, setVirtualHeight] = useState(workspaceEngine.virtual_height);

    return (
        <>
            <RightSideWidget
                name="Automatic grid creation"
                description="Generate a simple grid with uniform cell sizes by specifying the amount of cells in both directions."
                action={{
                    name: "Create",
                    callback: () => {
                        workspaceEngine.generateGrid(autoGridSize[0], autoGridSize[1]);
                    },
                }}>
                <Stack spacing={2} direction="row" sx={{ mt: 3 }} alignItems="center">
                    <TextField
                        label="Horizontal"
                        variant="outlined"
                        onChange={(e) => {
                            setAutoGridSize([parseInt(e.target.value), autoGridSize[1]]);
                        }}
                    />
                    <CloseIcon />
                    <TextField
                        label="Vertical"
                        variant="outlined"
                        onChange={(e) => {
                            setAutoGridSize([autoGridSize[0], parseInt(e.target.value)]);
                        }}
                    />
                </Stack>
            </RightSideWidget>
            <RightSideWidget
                name="Virtual size"
                description="You can provide an image size without specifying the unit. These numbers will be used to calculate distances between grid points."
                action={{ name: "Refresh", callback: () => {
                    workspaceEngine.setVirtualSizes(virtualWidth, virtualHeight);
                    workspaceEngine.redraw();
                } }}>
                <Stack spacing={2} direction="row" sx={{ mt: 3 }} alignItems="center">
                    <TextField
                        label="Width"
                        variant="outlined"
                        value={virtualWidth}
                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                        onChange={(e) => {
                            setVirtualWidth(parseInt(e.target.value));
                        }}
                    />
                    <CloseIcon />
                    <TextField
                        label="Height"
                        variant="outlined"
                        value={virtualHeight}
                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                        onChange={(e) => {
                            setVirtualHeight(parseInt(e.target.value));
                        }}
                    />
                </Stack>
            </RightSideWidget>
            <RightSideWidget name="Line color" description="">
                <Stack spacing={2} direction="row" sx={{ mt: 3 }} alignItems="center">
                    <ContrastIcon />
                    <Slider
                        defaultValue={50}
                        onChange={(e) => {
                            workspaceEngine.grid_color = "hsl(0, 0%, " + (100 - parseInt(e.target.value)) + "%)";
                        }}
                    />
                </Stack>
            </RightSideWidget>
        </>
    );
}

export default GridWidgets;
