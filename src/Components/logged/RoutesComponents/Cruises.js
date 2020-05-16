import React, { useState, useEffect } from 'react';


import AuthApi from '../../../authAPI';
import Allert from './components/Allert';
import { Grid } from '@material-ui/core';
import LoadingComponent from './components/LoadingComponent';
import {unauthorizedLogOut, GetRequestFunction } from './constants/functions';
import FormDisable from './components/FormDisable';
import OneCruise from './components/OneCruise';
import { useStyles } from './constants/styleObject';

const Cruises = () => {

    const classes = useStyles();
    const Auth = React.useContext(AuthApi);
    const [allert, setAllert] = React.useState({
        open: false,
        variant: 'filled',
        duration: 4000,
        type: 'success',
        title: 'success',
        msg: 'success msg',
    });
    const [isLoading, setIsLoading] = React.useState(true);
    const [isFormAvaliable, setIsFormAvaliable] = React.useState(undefined);
    const [disableFormProps, setDisableFormProps] = React.useState({ msg1: '', link: '', linkMsg: '', msg2: '' });
    const [data, setData] = useState();

    useEffect(()=>{
        try {
            //TODO: delete timeout before production
            setTimeout(() => {
                GetRequestFunction('/api/cruises')
                    .then(response => {
                        //unauthorized
                        if (response.error && response.error.code === 401) {
                            console.log('unauthorized');
                            setAllert({ ...allert, open: true, type: 'error', title: response.error.code, msg: response.error.msg })
                            setTimeout(() => {
                                Auth.setAuth(false);
                                unauthorizedLogOut();
                            }, 3000)
                        } else {
                            if (response.data && response.data.length === 0) {
                                setDisableFormProps({
                                    msg1: "You don't have any cruises. You Can ",
                                    link: '/dashboard/start/cruise',
                                    linkMsg: 'start one here',
                                    msg2: ''
                                });
                                setIsFormAvaliable(false);
                                setIsLoading(false)
                            } else if (response.error){
                                setAllert({ ...allert, duration: 99999, open: true, type: 'error', title: response.error.code, msg: response.error.msg + "Try to reload the page!!!" })
                            }
                            else {
                                setData(response)
                                setIsFormAvaliable(true);
                                setIsLoading(false)
                            }
                        }
                    })
            }, 1000)
        } catch (error) { console.log(error) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])


    return (
        <>
            <Grid className={classes.GridContainer}
                container
                spacing={5}
                justify="center"
                alignItems="center"
            >
                <Grid item xs={12} md={8} lg={6} xl={5}>
                    {isFormAvaliable === false && <FormDisable disableFormProps={disableFormProps} /> }
                    <Grid className={classes.GridContainer}
                        container
                        spacing={4}
                        justify="center"
                        alignItems="center"
                    >
                        {(isFormAvaliable === true && data.data) && data.data.map((cruise) => <OneCruise key={cruise.startDate} cruise={cruise}>{cruise.country}</OneCruise>)}
                    </Grid>
                    <LoadingComponent isLoadeing={isLoading} />
                </Grid>
                <Allert
                    allert={allert}
                    setAllert={setAllert} />
            </Grid>
        </>
     );
}

export default Cruises;