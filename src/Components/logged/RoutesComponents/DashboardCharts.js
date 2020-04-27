import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
    GridContainer: {
        width: '100%',
        margin: 0,
    },
    paper: {
        padding: "2vw",
        textAlign: "center",
        color: "black",
        whiteSpace: "nowrap",
        background: "rgba(255, 255, 255, 0.64)",
        marginTop: "2vh",
        marginBottom: "2vh"
    },
}))

const DashboardCharts = () => {
    const classes = useStyles();
    return (
        <Grid className={classes.GridContainer} container spacing={10}
            justify="flex-start"
            alignItems="flex-start">
            <Grid item xs={12} md={4}>
                <Paper className={classes.paper}> stats </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
                <Paper className={classes.paper}> current cruise </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
                <Paper className={classes.paper}> map</Paper>
            </Grid>
            <Grid item xs={12} md={8}>
                <Paper className={classes.paper}>xs=8</Paper>
            </Grid>
            <Grid item xs={12} md={4}>
                <Paper className={classes.paper}>xs=4</Paper>
            </Grid>
        </Grid>
     );
}

export default DashboardCharts;