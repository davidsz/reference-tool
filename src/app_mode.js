import { workspace_mode } from "./features/WorkspaceEngine";
import RightSideWidget from "./components/RightSideWidget";
import FileInput from "./components/FileInput";
import CloseIcon from "@mui/icons-material/Close";
import PublicIcon from "@mui/icons-material/Public";
import ContrastIcon from "@mui/icons-material/Contrast";
import { TextField, Stack, Switch, Slider, FormControlLabel } from "@mui/material";


export const app_mode = {
    LOAD_SESSION: {
        workspaceMode: workspace_mode.CONST,
        widgetsFor: (workspaceEngine) => (
            <RightSideWidget
                name="Load session"
                description="Restore your previous session from a .json file."
                action={{ name: "Restore", callback: () => { } }}
            >
                <FileInput />
            </RightSideWidget>
        ),
    },
    SAVE_SESSION: {
        workspace_mode: workspace_mode.CONST,
        widgetsFor: (workspaceEngine) => (
            <RightSideWidget
                name="Save session"
                description="Save your current session to a .json file."
                action={{ name: "Save", callback: () => { } }}
            >
                <FileInput />
            </RightSideWidget>
        ),
    },
    IMAGE: {
        workspaceMode: workspace_mode.IMAGE,
        widgetsFor: (workspaceEngine) => {
            let file_;
            let url_ = "";

            return (
                <>
                    <RightSideWidget
                        name="Using local image"
                        description="Select image file from your device."
                        action={{ name: "Load", callback: () => { workspaceEngine.loadLocalImage(file_) } }}
                    >
                        <FileInput onChange={(file) => file_ = file} />
                    </RightSideWidget>
                    <RightSideWidget
                        name="Image from URL"
                        description="Load image from network using a HTTP/HTTPS address."
                        action={{ name: "Load", callback: () => workspaceEngine.loadImageURL(url_) }}
                    >
                        <Stack spacing={2} direction="row" sx={{ mt: 3 }} alignItems="center">
                            <PublicIcon />
                            <TextField label="URL" onChange={(e) => url_ = e.target.value} variant="outlined" sx={{ flexGrow: 1 }} />
                        </Stack>
                    </RightSideWidget>
                </>
            );
        },
    },
    RESIZE: {
        workspaceMode: workspace_mode.RESIZE,
        widgetsFor: (workspaceEngine) => (
            <>
                <RightSideWidget
                    name="Resize image"
                    description="You can specify the desired aspect ratio."
                    action={{ name: "Resize", callback: () => { } }}
                >
                    <Stack spacing={2} direction="row" sx={{ mt: 3 }} alignItems="center">
                        <TextField label="Width" variant="outlined" />
                        <CloseIcon />
                        <TextField label="Height" variant="outlined" />
                    </Stack>
                </RightSideWidget>
                <RightSideWidget
                    description="Size corrections are not permanent. Here you can restore the image to its original size."
                    action={{ name: "Restore", callback: () => { } }}
                ></RightSideWidget>
            </>
        ),
    },
    GRID: {
        workspaceMode: workspace_mode.GRID,
        widgetsFor: (workspaceEngine) => (
            <>
                <RightSideWidget
                    name="Automatic grid creation"
                    description="Generate a simple grid with uniform cell sizes by specifying the amount of cells in both directions."
                    action={{ name: "Create", callback: () => { } }}
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
                    action={{ name: "Refresh", callback: () => { } }}
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
        ),
    },
    COLORS: {
        workspaceMode: workspace_mode.IMAGE,
        widgetsFor: (workspaceEngine) => (
            <RightSideWidget
                name="Color filters"
                description="A collection of quick filters to help with color validation."
            >
                <Stack spacing={2} direction="column" sx={{ mt: 3 }} alignItems="left">
                    <FormControlLabel control={<Switch onChange={() => { workspaceEngine.grayscale = !workspaceEngine.grayscale }} />} label="Black and white" />
                </Stack>
            </RightSideWidget>
        ),
    },
};
