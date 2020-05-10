import React from 'react';
import {Paper, Grid} from '@material-ui/core';
import {Link} from 'react-router-dom';


import { useStyles } from '../constants/styleObject'


const FormDisable = ({ disableFormProps }) => {
    const classes = useStyles();

    return(
        <Paper className={classes.paper}>
            <Grid className={classes.GridContainer}
                container
                spacing={3}
                justify="center"
                alignItems="center"
            >
                <Grid item xs={12} >
                    <p>{disableFormProps.msg1} </p>
                    <p><Link to={disableFormProps.link} style={{ color: 'rgb(66,133,235)', textDecoration: 'underline' }}>{disableFormProps.linkMsg}</Link> {disableFormProps.msg2}</p>
                </Grid>
            </Grid>
        </Paper>
    )
};

export default FormDisable;