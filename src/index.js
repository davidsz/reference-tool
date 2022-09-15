import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import singletonWorkspaceEngine from "./features/WorkspaceEngine";
import App from "./App";
import { theme } from "./theme";

export const WorkspaceContext = createContext();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <ThemeProvider theme={theme}>
        <WorkspaceContext.Provider value={singletonWorkspaceEngine}>
            <App />
        </WorkspaceContext.Provider>
    </ThemeProvider>
);
