import { AppBar, IconButton, Toolbar, styled } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

// Keep it always on top of the desktop version of side drawer
const ApplicationBar = styled(AppBar, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
    [theme.breakpoints.up("sm")]: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(open && {
            marginLeft: theme._drawerWidth,
            width: `calc(100% - ${theme._drawerWidth}px)`,
            transition: theme.transitions.create(["width", "margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
    },
}));

function TopBar({ children, drawerOpen, openDrawer }) {
    return (
        <ApplicationBar position="fixed" open={drawerOpen}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={openDrawer}
                    edge="start"
                    sx={{
                        marginRight: 5,
                        ...(drawerOpen && { display: "none" }),
                    }}
                >
                    <MenuIcon />
                </IconButton>
                {children}
            </Toolbar>
        </ApplicationBar>
    );
}

export default TopBar;
