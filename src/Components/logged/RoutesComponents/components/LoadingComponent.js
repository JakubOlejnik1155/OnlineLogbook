import React from 'react';
import {Backdrop, CircularProgress} from '@material-ui/core';
import { useStyles } from '../constants/styleObject';


const LoadingComponent = ({isLoadeing}) => {

    const classes = useStyles();

    return (
        <Backdrop className={classes.backdrop} open={isLoadeing}>
            <CircularProgress color="inherit" />
        </Backdrop>
    )
};

export default LoadingComponent;