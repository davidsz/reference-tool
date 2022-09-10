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

export default function App() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [zoomValue, setZoomValue] = useState(0);

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <TopBar drawerOpen={drawerOpen} openDrawer={() => setDrawerOpen(true)}>
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                    Ferenc - Reference tool
                </Typography>
                <Stack spacing={2} direction="row" sx={{ minWidth: 650, mr: 5 }} alignItems="center">
                    <ZoomOutIcon />
                    <Slider value={zoomValue} min={0} max={100} onChange={(e, newValue) => setZoomValue(newValue)}/>
                    <ZoomInIcon />
                </Stack>
                <IconButton color="inherit">
                    <FullscreenIcon />
                </IconButton>
            </TopBar>

            <LeftDrawer drawerOpen={drawerOpen} closeDrawer={() => setDrawerOpen(false)}>
                <List>
                    <LeftDrawerItem text="Load project" icon={<RestorePageRoundedIcon />} />
                    <LeftDrawerItem text="Save project" icon={<SaveRoundedIcon />} />
                </List>
                <Divider />
                <List>
                    <LeftDrawerItem text="Image" icon={<ImageRoundedIcon />} />
                    <LeftDrawerItem text="Resize" icon={<CropRoundedIcon />} />
                    <LeftDrawerItem text="Grid" icon={<Grid4x4RoundedIcon />} />
                    <LeftDrawerItem text="Colors" icon={<PaletteRoundedIcon />} />
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
                        <Paper elevation={3}>
                            <canvas id="workspace-canvas" width="500" height="500"></canvas>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <RightSideWidget />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
