import { useContext } from "react";
import { WorkspaceContext } from "../..";
import RightSideWidget from "./RightSideWidget";
import { Stack, TextField, Slider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContrastIcon from "@mui/icons-material/Contrast";

function GridWidgets() {
    const workspaceEngine = useContext(WorkspaceContext);

    return (
        <>
            <RightSideWidget
                name="Automatic grid creation"
                description="Generate a simple grid with uniform cell sizes by specifying the amount of cells in both directions."
                action={{ name: "Create", callback: () => {} }}
            >
                <Stack spacing={2} direction="row" sx={{ mt: 3 }} alignItems="center">
                    <TextField label="Horizontal" variant="outlined" />
                    <CloseIcon />
                    <TextField label="Vertical" variant="outlined" />
                </Stack>
            </RightSideWidget>
            <RightSideWidget
                name="Virtual size"
                description="You can provide an image size without specifying the unit. These numbers will be used to calculate distances between grid points."
                action={{ name: "Refresh", callback: () => {} }}
            >
                <Stack spacing={2} direction="row" sx={{ mt: 3 }} alignItems="center">
                    <TextField label="Width" variant="outlined" />
                    <CloseIcon />
                    <TextField label="Height" variant="outlined" />
                </Stack>
            </RightSideWidget>
            <RightSideWidget name="Line color" description="">
                <Stack spacing={2} direction="row" sx={{ mt: 3 }} alignItems="center">
                    <ContrastIcon />
                    <Slider defaultValue={50} />
                </Stack>
            </RightSideWidget>
        </>
    );
}

export default GridWidgets;
