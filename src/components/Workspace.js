import "./Workspace.css";
import { LocalStorageContext, WorkspaceContext } from "..";
import { useContext, useEffect, useRef } from "react";
import { Paper } from "@mui/material";
import useResizeObserver from "@react-hook/resize-observer";
import { SPLASH_IMAGE_URL } from "../theme";

function Workspace({ onScroll }) {
    const localStorageManager = useContext(LocalStorageContext);
    const workspaceEngine = useContext(WorkspaceContext);

    const workspaceOuterRef = useRef(null);
    useResizeObserver(workspaceOuterRef, (entry) => {
        workspaceEngine.resize(parseInt(entry.contentRect.width), parseInt(entry.contentRect.height));
        workspaceEngine.redrawSafe();
    });

    const addGridPoint = (e) => {
        let x = Math.round(e.pageX - e.target.getBoundingClientRect().left);
        let y = Math.round(e.pageY - e.target.getBoundingClientRect().top);
        workspaceEngine.addGridPoint(x, y);
    };

    useEffect(() => {
        workspaceEngine.init(document.getElementById("workspace-canvas"), document.getElementById("grid-handles-container"));
        let container = document.getElementById("workspace-outer");
        workspaceEngine.resize(container.offsetWidth, container.offsetHeight);
        let current_session = localStorageManager.get(localStorageManager.CURRENT)?.value;
        if (current_session && current_session.imageURI.length > 15) workspaceEngine.importFromJSON(current_session);
        else workspaceEngine.loadImageURL(SPLASH_IMAGE_URL);

        container.addEventListener(
            "wheel",
            (e) => {
                e.preventDefault();
                onScroll(parseInt(e.deltaY * -0.15));
            },
            { passive: false }
        );
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Paper elevation={2} id="workspace-outer" ref={workspaceOuterRef} sx={{ height: "calc(100% - 7px)" }}>
            <div id="grid-handles-container">
                <canvas id="workspace-canvas" width="500" height="500" onClick={addGridPoint}></canvas>
            </div>
        </Paper>
    );
}

export default Workspace;
