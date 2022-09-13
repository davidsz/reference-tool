import { WorkspaceContext } from ".";
import { useContext, useState } from "react";
import {
    Box,
    CssBaseline,
    Typography,
    Grid,
    IconButton,
    List,
    Divider,
    Stack,
    Slider,
    TextField,
    Switch,
    FormControlLabel,
} from "@mui/material";
import TopBar from "./components/TopBar";
import LeftDrawer from "./components/LeftDrawer";
import { LeftDrawerHeader, LeftDrawerItem } from "./components/LeftDrawer";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import RestorePageRoundedIcon from "@mui/icons-material/RestorePageRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import CropRoundedIcon from "@mui/icons-material/CropRounded";
import Grid4x4RoundedIcon from "@mui/icons-material/Grid4x4Rounded";
import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import RightSideWidget from "./components/RightSideWidget";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import CloseIcon from "@mui/icons-material/Close";
import PublicIcon from "@mui/icons-material/Public";
import ContrastIcon from "@mui/icons-material/Contrast";
import FileInput from "./components/FileInput";
import Workspace from "./components/Workspace";

const app_mode = {
    LOAD_SESSION: {
        widgets: (
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
        widgets: (
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
        widgets: (
            <>
                <RightSideWidget
                    name="Using local image"
                    description="Select image file from your device."
                    action={{ name: "Load", callback: () => { } }}
                >
                    <FileInput />
                </RightSideWidget>
                <RightSideWidget
                    name="Image from URL"
                    description="Load image from network using a HTTP/HTTPS address."
                    action={{ name: "Load", callback: () => { } }}
                >
                    <Stack spacing={2} direction="row" sx={{ mt: 3 }} alignItems="center">
                        <PublicIcon />
                        <TextField label="URL" variant="outlined" sx={{ flexGrow: 1 }} />
                    </Stack>
                </RightSideWidget>
            </>
        ),
    },
    RESIZE: {
        widgets: (
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
        widgets: (
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
        widgets: (
            <RightSideWidget
                name="Color filters"
                description="A collection of quick filters to help with color validation."
            >
                <Stack spacing={2} direction="column" sx={{ mt: 3 }} alignItems="left">
                    <FormControlLabel control={<Switch onChange={() => { }} />} label="Black and white" />
                </Stack>
            </RightSideWidget>
        ),
    },
};

export default function App() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [zoomValue, setZoomValue] = useState(0);
    const [appMode, setAppMode] = useState(app_mode.LOAD_SESSION);
    const [fullscreenMode, setFullscreenMode] = useState(false);

    const workspaceEngine = useContext(WorkspaceContext);

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />

            <TopBar drawerOpen={drawerOpen} openDrawer={() => setDrawerOpen(true)}>
                <Typography variant="h5" noWrap component="div" sx={{ flexGrow: 1 }}>
                    Ferenc - Reference tool
                </Typography>
                <Stack spacing={2} direction="row" sx={{ minWidth: 650, mr: 5 }} alignItems="center">
                    <ZoomOutIcon />
                    <Slider value={zoomValue} min={0} max={100} onChange={(e, newValue) => setZoomValue(newValue)} />
                    <ZoomInIcon />
                </Stack>
                <IconButton
                    color="inherit"
                    onClick={() => {
                        setFullscreenMode(!fullscreenMode);
                    }}
                >
                    <FullscreenIcon />
                </IconButton>
            </TopBar>

            <LeftDrawer drawerOpen={drawerOpen} closeDrawer={() => setDrawerOpen(false)}>
                <List>
                    <LeftDrawerItem
                        text="Load session"
                        icon={<RestorePageRoundedIcon />}
                        onClick={() => setAppMode(app_mode.LOAD_SESSION)}
                    />
                    <LeftDrawerItem
                        text="Save session"
                        icon={<SaveRoundedIcon />}
                        onClick={() => setAppMode(app_mode.SAVE_SESSION)}
                    />
                </List>
                <Divider />
                <List>
                    <LeftDrawerItem
                        text="Image"
                        icon={<ImageRoundedIcon />}
                        onClick={() => setAppMode(app_mode.IMAGE)}
                    />
                    <LeftDrawerItem
                        text="Resize"
                        icon={<CropRoundedIcon />}
                        onClick={() => setAppMode(app_mode.RESIZE)}
                    />
                    <LeftDrawerItem
                        text="Grid"
                        icon={<Grid4x4RoundedIcon />}
                        onClick={() => setAppMode(app_mode.GRID)}
                    />
                    <LeftDrawerItem
                        text="Colors"
                        icon={<PaletteRoundedIcon />}
                        onClick={() => setAppMode(app_mode.COLORS)}
                    />
                </List>
                <Divider />
                <List>
                    <LeftDrawerItem text="Reset" icon={<RestartAltRoundedIcon />} />
                </List>
            </LeftDrawer>

            <Box component="main" sx={{ display: "flex", flexDirection: "column", flexGrow: 1, p: 2, height: "100vh" }}>
                <LeftDrawerHeader />
                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                    <Grid item xs={9}>
                        <Workspace />
                    </Grid>
                    <Grid item xs={3}>
                        {appMode.widgets}
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
