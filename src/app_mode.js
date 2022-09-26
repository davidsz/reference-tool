import { workspace_mode } from "./features/WorkspaceEngine";
import ColorsWidgets from "./components/right_side/ColorsWidgets";
import ImageWidgets from "./components/right_side/ImageWidgets";
import ResizeWidgets from "./components/right_side/ResizeWidgets";
import GridWidgets from "./components/right_side/GridWidgets";
import LoadSessionWidgets from "./components/right_side/LoadSessionWidgets";
import SaveSessionWidgets from "./components/right_side/SaveSessionWidgets";

export const app_mode = {
    LOAD_SESSION: {
        workspaceMode: workspace_mode.CONST,
        widgets: <LoadSessionWidgets />,
    },
    SAVE_SESSION: {
        workspace_mode: workspace_mode.CONST,
        widgets: <SaveSessionWidgets />,
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
