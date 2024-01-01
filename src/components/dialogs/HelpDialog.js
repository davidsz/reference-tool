import AlertDialog from "./AlertDialog";
import { app_mode } from "../../app_mode";
import { Typography } from "@mui/material";

function HelpDialog({ open, setOpen, mode }) {
    let content = null;
    switch (mode) {
        case app_mode.LOAD_SESSION:
            content = (
                <Typography align="justify">
                    <Typography gutterBottom>Previously saved sessions can be restored from a .json file.</Typography>
                    <Typography>
                        These .json files contain everything: the image itself, grid point positions, virtual sizes, etc.
                    </Typography>
                </Typography>
            );
            break;
        case app_mode.SAVE_SESSION:
            content = (
                <Typography align="justify">
                    <Typography gutterBottom>Sessions can be saved into a .json file.</Typography>
                    <Typography>
                        These .json files contain everything: the image itself, grid point positions, virtual sizes, etc.
                    </Typography>
                </Typography>
            );
            break;
        case app_mode.IMAGE:
            content = (
                <Typography align="justify">
                    <Typography gutterBottom>
                        Choose an image file to work with! It can be selected from the local computer or can be provided by a web
                        link.
                    </Typography>
                    <Typography>The application will not modify the original image file in any circumstances.</Typography>
                </Typography>
            );
            break;
        case app_mode.RESIZE:
            content = (
                <Typography align="justify">
                    <Typography gutterBottom>
                        Here you can do size corrections on the image if that is too large or you would like to centerize any part
                        of it.
                    </Typography>
                    <Typography gutterBottom>
                        The resize rectangle can be moved by drag and drop. Resize handles can be moved freely in "Free mode" or
                        they will stick to the provided aspect ratio in "Keep aspect ratio" mode.
                    </Typography>
                    <Typography>The application will not modify the original image file in any circumstances.</Typography>
                </Typography>
            );
            break;
        case app_mode.GRID:
            content = (
                <Typography align="justify">
                    <Typography gutterBottom>
                        This is the most important part of the application. You can place reference lines on the displayed image
                        and use them to copy the desired parts accurately to traditional media.
                    </Typography>
                    <Typography gutterBottom>
                        A reference point can be placed on the workspace by clicking, and they can be rearranged by dragging. The
                        points will have a horizontal and a vertical line by default. Changing between this, horizontal only and
                        vertical only points can be done by right mouse click on the point. A long mouse click will remove the
                        desired reference point.
                    </Typography>
                    <Typography gutterBottom>
                        The application can generate an evenly distributed grid system by the "Automatic grid creation" function.
                        The user has to provide the number of cells in both directions.
                    </Typography>
                    <Typography gutterBottom>
                        The cell sizes (between reference lines) will be displayed on the margins of the workspace. These are not
                        specified measurement units; the user can provide pixels, millimeters, inches or anything at the "Virtual
                        size" section.
                    </Typography>
                    <Typography>The application will not modify the original image file in any circumstances.</Typography>
                </Typography>
            );
            break;
        case app_mode.COLORS:
            content = (
                <Typography align="justify">
                    <Typography gutterBottom>
                        Here you can find a collection of quick and simple color filters which can help to validate your result
                        artwork from other artistic perspectives.
                    </Typography>
                    <Typography>The application will not modify the original image file in any circumstances.</Typography>
                </Typography>
            );
            break;
        default:
            content = <Typography>Under construction</Typography>;
            break;
    }

    return (
        <AlertDialog
            open={open}
            onAccept={() => {}}
            onReject={() => {}}
            onClose={() => setOpen(false)}
            title={`Help - ${mode.title}`}>
            {content}
        </AlertDialog>
    );
}

export default HelpDialog;
