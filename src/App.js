import "./App.css";
import { useState } from "react";
import { Box, CssBaseline, Typography, Paper, Grid, IconButton, List, Divider, Stack, Slider } from "@mui/material";
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

const app_mode = {
    LOAD_SESSION: {
        widgets: (
            <RightSideWidget
                name="Load session"
                description="Restore your previous session from a .json file."
                action={{ name: "Restore", callback: () => {} }}
            >
                Here goes the file input.
            </RightSideWidget>
        ),
    },
    SAVE_SESSION: {
        widgets: (
            <RightSideWidget
                name="Save session"
                description="Save your current session to a .json file."
                action={{ name: "Save", callback: () => {} }}
            >
                Here goes the file input.
            </RightSideWidget>
        ),
    },
    IMAGE: {
        widgets: (
            <RightSideWidget
                name="Select image"
                description="Provide an image to work with."
                action={{ name: "Use", callback: () => {} }}
            >
                Here goes the file input.
            </RightSideWidget>
        ),
    },
    RESIZE: {
        widgets: (
            <>
                <RightSideWidget
                    name="Selection size"
                    description="Provide an image to work with."
                    action={{ name: "Resize", callback: () => {} }}
                >
                    Here goes the number input.
                </RightSideWidget>
                <RightSideWidget
                    name=""
                    description="Restore image to its original size."
                    action={{ name: "Restore", callback: () => {} }}
                ></RightSideWidget>
            </>
        ),
    },
    GRID: {
        widgets: (
            <>
                <RightSideWidget
                    name="Automatic grid creation"
                    description="Generate a simple grid with uniform cell sizes."
                    action={{ name: "Create", callback: () => {} }}
                >
                    Here goes the number input.
                </RightSideWidget>
                <RightSideWidget
                    name="Virtual size"
                    description="You can provide an image size without specifying the unit. These numbers will be used to calculate distances between grid points."
                >
                    Here goes the range input.
                </RightSideWidget>
                <RightSideWidget name="Line color" description="">
                    Here goes the range input.
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
                Here go a couple of checkbox input.
            </RightSideWidget>
        ),
    },
};

export default function App() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [zoomValue, setZoomValue] = useState(0);
    const [appMode, setAppMode] = useState(app_mode.LOAD_SESSION);

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <TopBar drawerOpen={drawerOpen} openDrawer={() => setDrawerOpen(true)}>
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                    Ferenc - Reference tool
                </Typography>
                <Stack spacing={2} direction="row" sx={{ minWidth: 650, mr: 5 }} alignItems="center">
                    <ZoomOutIcon />
                    <Slider value={zoomValue} min={0} max={100} onChange={(e, newValue) => setZoomValue(newValue)} />
                    <ZoomInIcon />
                </Stack>
                <IconButton color="inherit">
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

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <LeftDrawerHeader />
                <Grid container spacing={2}>
                    <Grid item xs={9}>
                        <Paper elevation={2}>
                            <canvas id="workspace-canvas" width="500" height="500"></canvas>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        {appMode.widgets}
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
