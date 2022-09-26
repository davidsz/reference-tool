// import { useContext } from "react";
// import { WorkspaceContext } from "../..";
import RightSideWidget from "./RightSideWidget";
import FileInput from "../FileInput";

function LoadSessionWidgets() {
    // const workspaceEngine = useContext(WorkspaceContext);

    return (
        <RightSideWidget
            name="Load session"
            description="Restore your previous session from a .json file."
            action={{ name: "Restore", callback: () => {} }}>
            <FileInput />
        </RightSideWidget>
    );
}

export default LoadSessionWidgets;
