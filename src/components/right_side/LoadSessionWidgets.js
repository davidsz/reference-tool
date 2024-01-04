import { useContext, useState } from "react";
import { WorkspaceContext } from "../..";
import RightSideWidget from "./RightSideWidget";
import FileInput from "../FileInput";

function LoadSessionWidgets() {
    const workspaceEngine = useContext(WorkspaceContext);
    const [file, setFile] = useState();

    return (
        <RightSideWidget
            name="Load session"
            description="Restore your previous session from a .json file."
            action={{
                name: "Restore",
                callback: () => {
                    let fileReader = new FileReader();
                    fileReader.onload = () => {
                        let json = JSON.parse(fileReader.result);
                        workspaceEngine.importFromJSON(json);
                    };
                    fileReader.readAsText(file);
                },
            }}>
            <FileInput accept="application/json" onChange={(f) => setFile(f)} />
        </RightSideWidget>
    );
}

export default LoadSessionWidgets;
