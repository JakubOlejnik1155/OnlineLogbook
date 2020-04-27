import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles((theme) => ({
    GridContainer: {
        width: '100%',
        margin: 0,
    },
}))


const NewCruiseform = () => {
    const classes = useStyles();
    return (
        <Grid className={classes.GridContainer}>
        NewCruiseform
        </Grid>
     );
}

export default NewCruiseform;