import { WorkspaceContext } from ".";
import { useContext, useState } from "react";
import { app_mode } from "./app_mode";
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
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import Workspace from "./components/Workspace";

export default function App() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [appMode, setAppMode] = useState(app_mode.LOAD_SESSION);
    const [zoomValue, setZoomValue] = useState(100);
    const [fullscreenMode, setFullscreenMode] = useState(false);

    const workspaceEngine = useContext(WorkspaceContext);

    const changeAppMode = (mode) => {
        setAppMode(() => {
            workspaceEngine.setMode(mode.workspaceMode);
            return mode;
        });
    };

    const handleWorkspaceScroll = (inc) => {
        setZoomValue((prev) => {
            let value = prev + inc;
            if (value < 50 || value > 250)
                return prev;
            workspaceEngine.scale = value / 100;
            return value;
        });
    }

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />

            <TopBar drawerOpen={drawerOpen} openDrawer={() => setDrawerOpen(true)}>
                <Typography variant="h5" noWrap component="div" sx={{ flexGrow: 1 }}>
                    Ferenc - Reference tool
                </Typography>
                <Stack spacing={2} direction="row" sx={{ minWidth: 650, mr: 5 }} alignItems="center">
                    <ZoomOutIcon />
                    <Slider value={zoomValue} min={50} max={250} onChange={(e, value) => {
                        workspaceEngine.scale = value / 100;
                        setZoomValue(value);
                    }} />
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
                        onClick={() => changeAppMode(app_mode.LOAD_SESSION)}
                    />
                    <LeftDrawerItem
                        text="Save session"
                        icon={<SaveRoundedIcon />}
                        onClick={() => changeAppMode(app_mode.SAVE_SESSION)}
                    />
                </List>
                <Divider />
                <List>
                    <LeftDrawerItem
                        text="Image"
                        icon={<ImageRoundedIcon />}
                        onClick={() => changeAppMode(app_mode.IMAGE)}
                    />
                    <LeftDrawerItem
                        text="Resize"
                        icon={<CropRoundedIcon />}
                        onClick={() => changeAppMode(app_mode.RESIZE)}
                    />
                    <LeftDrawerItem
                        text="Grid"
                        icon={<Grid4x4RoundedIcon />}
                        onClick={() => changeAppMode(app_mode.GRID)}
                    />
                    <LeftDrawerItem
                        text="Colors"
                        icon={<PaletteRoundedIcon />}
                        onClick={() => changeAppMode(app_mode.COLORS)}
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
                        <Workspace onScroll={handleWorkspaceScroll} />
                    </Grid>
                    <Grid item xs={3}>
                        {appMode.widgets}
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
