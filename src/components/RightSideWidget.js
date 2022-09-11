import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

function RightSideWidget({ name, description, children, action }) {
    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                    {name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
                {children}
            </CardContent>
            {action && (
                <CardActions sx={{ justifyContent: "right" }}>
                    <Button size="small" variant="contained" onClick={action?.callback}>
                        {action?.name}
                    </Button>
                </CardActions>
            )}
        </Card>
    );
}

export default RightSideWidget;
