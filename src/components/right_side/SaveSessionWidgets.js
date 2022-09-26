import { useContext } from "react";
import { WorkspaceContext } from "../..";
import { saveJSONFile } from "../../features/helper";
import RightSideWidget from "./RightSideWidget";

function SaveSessionWidgets() {
    const workspaceEngine = useContext(WorkspaceContext);

    return (
        <RightSideWidget
            name="Save session"
            description="Save your current session to a .json file."
            action={{ name: "Save", callback: () => {
                let json = workspaceEngine.exportAsJSON();
                saveJSONFile("ferenc_session.json", JSON.stringify(json));
            } }}></RightSideWidget>
    );
}

export default SaveSessionWidgets;
