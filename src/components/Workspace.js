import "./Workspace.css";
import { WorkspaceContext } from "..";
import { useContext, useEffect, useRef } from "react";
import { styled, Paper } from "@mui/material";
import useResizeObserver from "@react-hook/resize-observer";

// Aligns the close button and keeps the content below the app bar
const GridHandlesContainer = styled("div")(({ theme }) => ({
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
}));

function Workspace({ onScroll }) {
    const workspaceEngine = useContext(WorkspaceContext);

    const workspaceOuterRef = useRef(null);
    useResizeObserver(workspaceOuterRef, (entry) => {
        workspaceEngine.resize(parseInt(entry.contentRect.width), parseInt(entry.contentRect.height));
        workspaceEngine.redraw();
    });

    const addGridPoint = (e) => {
        let x = Math.round(e.pageX - e.target.getBoundingClientRect().left);
        let y = Math.round(e.pageY - e.target.getBoundingClientRect().top);
        workspaceEngine.addGridPoint(x, y);
    };

    useEffect(() => {
        workspaceEngine.init(
            document.getElementById("workspace-canvas"),
            document.getElementById("grid-handles-container")
        );
        let container = document.getElementById("workspace-outer");
        workspaceEngine.resize(container.offsetWidth, container.offsetHeight);
        workspaceEngine.loadImageURL("image/splash.png");

        container.addEventListener("wheel", (e) => {
            e.preventDefault();
            onScroll(parseInt(e.deltaY * -0.15));
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Paper elevation={2} id="workspace-outer" ref={workspaceOuterRef} sx={{ height: "calc(100% - 7px)" }}>
            <GridHandlesContainer id="grid-handles-container">
                <canvas id="workspace-canvas" width="500" height="500" onClick={addGridPoint}></canvas>
            </GridHandlesContainer>
        </Paper>
    );
}

export default Workspace;
