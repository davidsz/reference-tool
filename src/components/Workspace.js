import { WorkspaceContext } from "..";
import { useContext, useEffect } from "react";
import { styled, Paper } from "@mui/material";

// Aligns the close button and keeps the content below the app bar
const GridHandlesContainer = styled("div")(({ theme }) => ({
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
}));

function Workspace({ onScroll }) {
    const workspaceEngine = useContext(WorkspaceContext);

    useEffect(() => {
        workspaceEngine.init(
            document.getElementById("workspace-canvas"),
            document.getElementById("grid-handles-container")
        );
        workspaceEngine.resize(document.getElementById("workspace-outer"));
        workspaceEngine.loadImageURL("image/splash.png");

        document.getElementById("workspace-outer").addEventListener("wheel", (e) => {
            e.preventDefault();
            onScroll(parseInt(e.deltaY * -0.15));
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Paper elevation={2} id="workspace-outer" sx={{ height: "calc(100% - 7px)" }}>
            <GridHandlesContainer id="grid-handles-container">
                <canvas id="workspace-canvas" width="500" height="500"></canvas>
            </GridHandlesContainer>
        </Paper>
    );
}

export default Workspace;
