import { LocalStorageContext, WorkspaceContext } from ".";
import { useContext, useState, useEffect } from "react";
import { app_mode } from "./app_mode";
import { Box, CssBaseline, Typography, Grid, IconButton, List, Divider, Stack, Slider } from "@mui/material";
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
import InfoIcon from "@mui/icons-material/Info";
import HelpIcon from "@mui/icons-material/Help";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import Workspace from "./components/Workspace";
import ConfirmDialog from "./components/dialogs/ConfirmDialog";
import { SPLASH_IMAGE_URL } from "./theme";
import AboutDialog from "./components/dialogs/AboutDialog";
import HelpDialog from "./components/dialogs/HelpDialog";

export default function App() {
    const localStorageManager = useContext(LocalStorageContext);
    const workspaceEngine = useContext(WorkspaceContext);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [appMode, setAppMode] = useState(app_mode.LOAD_SESSION);
    const [zoomValue, setZoomValue] = useState(workspaceEngine.scale * 100);
    const [fullscreenMode, setFullscreenMode] = useState(false);
    const [resetDialogOpen, setResetDialogOpen] = useState(false);
    const [helpDialogOpen, setHelpDialogOpen] = useState(false);
    const [aboutDialogOpen, setAboutDialogOpen] = useState(false);

    useEffect(() => {
        document.documentElement.addEventListener("fullscreenchange", () => {
            // The canvas programmatically adapts itself to its parent's size. Workaround growing-only
            // canvas issue by removing it temporarily from the layout and letting the other elements
            // take place as they please before inserting drawing area again.
            workspaceEngine.canvas.style.display = "none";
            setFullscreenMode(!!document.fullscreenElement);
            workspaceEngine.canvas.style.display = "block";
        });
        window.addEventListener("beforeunload", (e) => {
            e.preventDefault();
            localStorageManager.set(localStorageManager.CURRENT, workspaceEngine.exportAsJSON());
        });

        workspaceEngine.setMode(appMode.workspaceMode);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const changeAppMode = (mode) => {
        setAppMode(() => {
            workspaceEngine.setMode(mode.workspaceMode);
            return mode;
        });
    };

    const handleWorkspaceScroll = (inc) => {
        setZoomValue((prev) => {
            let value = prev + inc;
            if (value < 50 || value > 250) return prev;
            workspaceEngine.scale = value / 100;
            return value;
        });
    };

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            {!fullscreenMode && (
                <>
                    <TopBar drawerOpen={drawerOpen} openDrawer={() => setDrawerOpen(true)}>
                        <Typography variant="h5" noWrap component="div" sx={{ flexGrow: 1 }}>
                            Ferenc - Reference tool
                        </Typography>
                        <Stack spacing={2} direction="row" sx={{ minWidth: 650, mr: 5 }} alignItems="center">
                            <ZoomOutIcon />
                            <Slider
                                value={zoomValue}
                                min={50}
                                max={250}
                                onChange={(e, value) => {
                                    workspaceEngine.scale = value / 100;
                                    setZoomValue(value);
                                }}
                            />
                            <ZoomInIcon />
                        </Stack>
                        <IconButton
                            color="inherit"
                            onClick={() => {
                                if (document.fullscreenElement) document.exitFullscreen();
                                else document.documentElement.requestFullscreen();
                            }}>
                            <FullscreenIcon />
                        </IconButton>
                    </TopBar>

                    <LeftDrawer drawerOpen={drawerOpen} closeDrawer={() => setDrawerOpen(false)}>
                        <List>
                            <LeftDrawerItem
                                text={app_mode.LOAD_SESSION.title}
                                icon={<RestorePageRoundedIcon />}
                                onClick={() => changeAppMode(app_mode.LOAD_SESSION)}
                            />
                            <LeftDrawerItem
                                text={app_mode.SAVE_SESSION.title}
                                icon={<SaveRoundedIcon />}
                                onClick={() => changeAppMode(app_mode.SAVE_SESSION)}
                            />
                        </List>
                        <Divider />
                        <List>
                            <LeftDrawerItem
                                text={app_mode.IMAGE.title}
                                icon={<ImageRoundedIcon />}
                                onClick={() => changeAppMode(app_mode.IMAGE)}
                            />
                            <LeftDrawerItem
                                text={app_mode.RESIZE.title}
                                icon={<CropRoundedIcon />}
                                onClick={() => changeAppMode(app_mode.RESIZE)}
                            />
                            <LeftDrawerItem
                                text={app_mode.GRID.title}
                                icon={<Grid4x4RoundedIcon />}
                                onClick={() => changeAppMode(app_mode.GRID)}
                            />
                            <LeftDrawerItem
                                text={app_mode.COLORS.title}
                                icon={<PaletteRoundedIcon />}
                                onClick={() => changeAppMode(app_mode.COLORS)}
                            />
                        </List>
                        <Divider />
                        <List>
                            <LeftDrawerItem
                                text="Reset"
                                icon={<RestartAltRoundedIcon />}
                                onClick={() => setResetDialogOpen(true)}
                            />
                            <LeftDrawerItem text="Help" icon={<HelpIcon />} onClick={() => setHelpDialogOpen(true)} />
                            <LeftDrawerItem text="About" icon={<InfoIcon />} onClick={() => setAboutDialogOpen(true)} />
                        </List>
                    </LeftDrawer>
                </>
            )}

            <Box
                component="main"
                sx={{ display: "flex", flexDirection: "column", flexGrow: 1, p: fullscreenMode ? 0 : 2, height: "100vh" }}>
                {!fullscreenMode && <LeftDrawerHeader />}
                <Grid container spacing={fullscreenMode ? 0 : 2} sx={{ flexGrow: 1 }}>
                    <Grid item xs={fullscreenMode ? 12 : 9}>
                        <Workspace onScroll={handleWorkspaceScroll} />
                    </Grid>
                    {!fullscreenMode && (
                        <Grid item xs={3}>
                            {appMode.widgets}
                        </Grid>
                    )}
                </Grid>
            </Box>

            <ConfirmDialog
                open={resetDialogOpen}
                onAccept={() => {
                    localStorageManager.remove(localStorageManager.CURRENT);
                    workspaceEngine.loadImageURL(SPLASH_IMAGE_URL);
                    setZoomValue(100);
                    changeAppMode(app_mode.LOAD_SESSION);
                }}
                onReject={() => {}}
                onClose={() => setResetDialogOpen(false)}
                title="Are you sure you want to reset the workspace?"></ConfirmDialog>

            <HelpDialog open={helpDialogOpen} setOpen={setHelpDialogOpen} mode={appMode} />

            <AboutDialog open={aboutDialogOpen} setOpen={setAboutDialogOpen} />
        </Box>
    );
}
