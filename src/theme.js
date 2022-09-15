import { createTheme } from "@mui/material";

export const theme = createTheme({
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
