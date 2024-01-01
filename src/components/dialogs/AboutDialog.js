import AlertDialog from "./AlertDialog";
import { Box, Typography, Stack, Link } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import { LOGO_IMAGE_URL } from "../../theme";

function AboutDialog({ open, setOpen }) {
    return (
        <AlertDialog open={open} onAccept={() => {}} onReject={() => {}} onClose={() => setOpen(false)} title="About">
            <Stack spacing={3} alignItems="center" direction="row" sx={{ marginBottom: 5 }}>
                <Box
                    component="img"
                    sx={{
                        height: 150,
                        width: 150,
                    }}
                    alt="Ferenc logo"
                    src={LOGO_IMAGE_URL}
                />
                <Typography align="justify">
                    Ferenc is a free, lightweight and web based reference tool for artists who seek a way to transfer digital
                    images from their display to traditional media, such as paper or canvas.
                </Typography>
            </Stack>
            <Stack spacing={2} sx={{ marginBottom: 2 }} direction="row">
                <GitHubIcon />
                <Typography>
                    <Link
                        href="https://github.com/davidsz/reference-tool"
                        underline="hover"
                        color="secondary"
                        rel="noreferrer"
                        target="_blank">
                        https://github.com/davidsz/reference-tool
                    </Link>
                </Typography>
            </Stack>
            <Typography>Copyright &copy; 2022-{new Date().getFullYear()}, Szabolcs David</Typography>
        </AlertDialog>
    );
}

export default AboutDialog;
