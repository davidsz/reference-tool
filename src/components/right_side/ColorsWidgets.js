import { useContext, useState } from "react";
import { WorkspaceContext } from "../..";
import RightSideWidget from "./RightSideWidget";
import { FormControlLabel, Stack, Switch } from "@mui/material";

function ColorsWidgets() {
    const workspaceEngine = useContext(WorkspaceContext);
    const [grayscale, setGrayscale] = useState(workspaceEngine.grayscale);

    return (
        <RightSideWidget
            name="Color filters"
            description="A collection of quick filters to help with color validation."
        >
            <Stack spacing={2} direction="column" sx={{ mt: 3 }} alignItems="left">
                <FormControlLabel
                    control={
                        <Switch
                            checked={grayscale}
                            onChange={(e) => {
                                setGrayscale(e.target.checked);
                                workspaceEngine.grayscale = e.target.checked;
                            }}
                        />
                    }
                    label="Black and white"
                />
            </Stack>
        </RightSideWidget>
    );
}

export default ColorsWidgets;
