import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import singletonWorkspaceEngine from "./features/WorkspaceEngine";
import App from "./App";

const theme = createTheme({
    _drawerWidth: 240,
    palette: {
        mode: "dark",
        primary: {
            main: "#1B1D23",
        },
        secondary: {
            main: "#0288d1",
        },
        background: {
            default: "#121212",
            paper: "#1B1D23"
        },
        text: {
            primary: "#72d2f7",
        },
    },
});

export const WorkspaceContext = createContext();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <ThemeProvider theme={theme}>
        <WorkspaceContext.Provider value={singletonWorkspaceEngine}>
            <App />
        </WorkspaceContext.Provider>
    </ThemeProvider>
);
