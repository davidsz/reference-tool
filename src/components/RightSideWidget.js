import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function RightSideWidget() {
    return (
        <Card>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    Function name
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Here go the function parameters
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Button 1</Button>
                <Button size="small">Button 2</Button>
            </CardActions>
        </Card>
    );
}

export default RightSideWidget;
