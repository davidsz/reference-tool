import {
    Divider,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Drawer,
    IconButton,
    useTheme,
    styled,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

// Aligns the close button and keeps the content below the app bar
export const LeftDrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

export function LeftDrawerItem(props) {
    return (
        <ListItem key={props.text} disablePadding>
            <ListItemButton onClick={props.onClick}>
                <ListItemIcon>
                    {props.icon}
                </ListItemIcon>
                <ListItemText primary={props.text} />
            </ListItemButton>
        </ListItem>
    );
}

const openedMixin = (theme) => ({
    width: theme._drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme) => ({
    width: `calc(${theme.spacing(7)} + 1px)`,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
});

const DesktopDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
    }),
}));

function LeftDrawer({ children, drawerOpen, closeDrawer }) {
    const theme = useTheme();

    const drawerContent = (
        <div>
            <LeftDrawerHeader>
                <IconButton onClick={closeDrawer}>
                    <ChevronLeftIcon />
                </IconButton>
            </LeftDrawerHeader>
            <Divider />
            {children}
        </div>
    );

    return (
        <>
            <DesktopDrawer variant="permanent" open={drawerOpen} sx={{ display: { xs: "none", sm: "block" } }}>
                {drawerContent}
            </DesktopDrawer>

            <Drawer
                container={window.document.body}
                variant="temporary"
                open={drawerOpen}
                onClose={closeDrawer}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: "block", sm: "none" },
                    "& .MuiDrawer-paper": { boxSizing: "border-box", width: theme._drawerWidth },
                }}
            >
                {drawerContent}
            </Drawer>
        </>
    );
}

export default LeftDrawer;
