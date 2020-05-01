import React from 'react';
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { AlertTitle } from '@material-ui/lab';

const Allert = ({allert, setAllert}) => {

    const Alert = (props) => {
        return <MuiAlert elevation={6} variant={allert.variant} {...props} />;
    }

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setAllert({...allert, open: false});
    };


    return (
        <Snackbar open={allert.open} autoHideDuration={allert.duration} onClose={handleClose}>
            <Alert onClose={handleClose} severity={allert.type}>
                <AlertTitle>{allert.title}</AlertTitle>
                {allert.msg}
                </Alert>
        </Snackbar>
     );
}

export default Allert;