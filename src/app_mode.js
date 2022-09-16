import { workspace_mode } from "./features/WorkspaceEngine";
import RightSideWidget from "./components/right_side/RightSideWidget";
import FileInput from "./components/FileInput";
import ColorsWidgets from "./components/right_side/ColorsWidgets";
import ImageWidgets from "./components/right_side/ImageWidgets";
import ResizeWidgets from "./components/right_side/ResizeWidgets";
import GridWidgets from "./components/right_side/GridWidgets";

export const app_mode = {
    LOAD_SESSION: {
        workspaceMode: workspace_mode.CONST,
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
        workspace_mode: workspace_mode.CONST,
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
        workspaceMode: workspace_mode.IMAGE,
        widgets: <ImageWidgets />,
    },
    RESIZE: {
        workspaceMode: workspace_mode.RESIZE,
        widgets: <ResizeWidgets />,
    },
    GRID: {
        workspaceMode: workspace_mode.GRID,
        widgets: <GridWidgets />,
    },
    COLORS: {
        workspaceMode: workspace_mode.IMAGE,
        widgets: <ColorsWidgets />,
    },
};
