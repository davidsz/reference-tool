import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import singletonLocalStorageManager from "./features/LocalStorageManager";
import singletonWorkspaceEngine from "./features/WorkspaceEngine";
import App from "./App";
import { theme } from "./theme";

export const LocalStorageContext = createContext();
export const WorkspaceContext = createContext();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <ThemeProvider theme={theme}>
        <LocalStorageContext.Provider value={singletonLocalStorageManager}>
            <WorkspaceContext.Provider value={singletonWorkspaceEngine}>
                <App />
            </WorkspaceContext.Provider>
        </LocalStorageContext.Provider>
    </ThemeProvider>
);
