import React, { useContext } from 'react';
import { Grid, Paper, Typography, Input, Button } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useMobileDetect from 'use-mobile-detect-hook';
import SendTwoToneIcon from '@material-ui/icons/SendTwoTone';
import CoordinateInput from "react-coordinate-input";
import Cookies from 'js-cookie';

import { useStyles } from './constants/styleObject'
import Allert from './components/Allert';
import { convertDMS, PostRequestFunction, unauthorizedLogOut, GetRequestFunction } from './constants/functions';
import { CssTextField } from './constants/styleObject';
import FormDisable from './components/FormDisable';
import LoadingComponent from './components/LoadingComponent';
import AuthApi from '../../../authAPI';


const defaultValues = {
    data: {
        windSpeed: 0,
        seaState: 0
    }
}

const NewWaypoint = () => {
    const Auth = useContext(AuthApi);
    const classes = useStyles();
    const matchesXS = useMediaQuery('(max-width:600px)');
    const matchesSM = useMediaQuery('(min-width:600px)');
    const detectMobile = useMobileDetect();
    const { register, handleSubmit } = useForm({ defaultValues });
    const [gpsModule, setGpsModule] = React.useState(true);
    const [isRedirection, setIsRedirection] = React.useState(false);
    const [disableFormProps, setDisableFormProps] = React.useState({ msg1: '', link: '', linkMsg: '', msg2: '' });
    const [isLoading, setIsLoading] = React.useState(true);
    const [isFormAvaliable, setIsFormAvaliable] = React.useState(undefined);
    const [mobilePosition, setMobilePosition] = React.useState({
        lat: 0,
        lng: 0
    });
    const [allert, setAllert] = React.useState({
        open: false,
        variant: 'filled',
        duration: 4000,
        type: 'success',
        title: 'success',
        msg: 'success msg',
    });
    let position = {
        lat: 0,
        lng: 0
    };

    React.useEffect(() => {
        if (detectMobile.isMobile() && Cookies.get("GPSmoduleDisabled")) setGpsModule(false)
        try {
                GetRequestFunction('/api/days/current')
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
                            if (response.data && response.data.length === 1) {
                                setIsFormAvaliable(true);
                                setIsLoading(false)
                            } else {
                                setDisableFormProps({
                                    msg1: "Oops! It looks like you have no active day.",
                                    link: '/dashboard/start/day',
                                    linkMsg: 'Start it',
                                    msg2: 'before add hour entry'
                                });
                                setIsFormAvaliable(false);
                                setIsLoading(false)
                            }
                        }
                    })
        } catch (error) { console.log(error) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const renderRedirect = () => {
        if (isRedirection) {
            return <Redirect to='/dashboard' />
        }
    };

    const onSubmit = (values) => {
        // required validation must have inputs
        if (detectMobile.isMobile()) {
            values.data.latitude = mobilePosition.lat;
            values.data.longitude = mobilePosition.lng;
        } else {
            values.data.latitude = position.lat;
            values.data.longitude = position.lng;
        }
        if ( values.data.longitude === 0 || values.data.latitude === 0 || values.data.name === '')
            return setAllert({ ...allert, open: true, msg: 'fill all required inputs marked by *', title: 'bad inputs', type: 'error' })

        try {
            setIsLoading(true);
            PostRequestFunction('/api/days/waypoint', values)
                .then(response => {
                    if (response.error && response.error.code === 401) {
                        setAllert({ ...allert, open: true, type: 'error', title: response.error.code, msg: response.error.msg })
                        setTimeout(() => {
                            Auth.setAuth(false);
                            unauthorizedLogOut();
                        }, 3000)
                    } else {
                        if (response.error) {
                            setIsLoading(false);
                            return setAllert({ ...allert, open: true, type: 'warning', title: response.error.code, msg: response.error.msg })
                        }
                        else if (response.success) {
                            setIsLoading(false);
                            setAllert({ ...allert, open: true, type: 'success', title: 'success', msg: 'waypoint was added!' });
                            setTimeout(() => setIsRedirection(true), 4000);
                        }
                        else {
                            setIsLoading(false);
                            setAllert({ ...allert, open: true, type: 'info', title: 'error: 500', msg: 'it looks that something went wrong maybe try again?' });
                        }
                    }
                })

        } catch (error) {
            setIsLoading(false);
            setAllert({ ...allert, open: true, type: 'error', title: 'error: 500', msg: 'it looks that something went wrong maybe try again?' });
        }


    };
    const getGPSHandler = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
                setMobilePosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            });
        }
    };
    const handleGpsPositionChange = (e, { dd, dms, dmsArray }) => {
        position.lat = dd[0];
        position.lng = dd[1];

    };
    const Form = () => (
        <Paper className={classes.paper}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid className={classes.GridContainer}
                    container
                    spacing={4}
                    justify="center"
                    alignItems="center"
                >
                    <Grid item xs={12} style={matchesXS ? { borderBottom: '1px solid black' } : { borderBottom: '1px solid black', paddingTop: '0px' }}>
                        <Typography variant="h5">Waypoint Entry</Typography>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                        {detectMobile.isMobile() && gpsModule ? (
                            <>
                                <Input value={convertDMS(mobilePosition.lat, mobilePosition.lng)} style={{ width: '80%' }} inputProps={{ min: 0, style: { textAlign: 'center' } }} />
                                <Button onClick={getGPSHandler}
                                    variant="outlined"
                                    color="secondary"
                                    style={{ marginTop: '10px' }}
                                > first click to get position*</Button>
                                <Typography variant="body2" style={{ color: 'gray', fontSize: '11px' }}>this may take a while</Typography>
                                <Typography variant="body2" onClick={() => { Cookies.set("GPSmoduleDisabled", true, { expires: 365 }); setGpsModule(false) }} style={{ padding: '2px', width: '150px', margin: '0 auto', color: 'rgb(66,133,235)', textDecoration: 'underline', fontSize: '11px' }}>Use traditional input</Typography>
                            </>
                        ) : (
                                <>
                                    <Typography variant="overline" style={{ width: '100%', display: 'block' }}>GPS position*</Typography>
                                    <CoordinateInput onChange={handleGpsPositionChange} className={classes.GPSInput} />
                                    {(detectMobile.isMobile() && Cookies.get("GPSmoduleDisabled")) && <Typography variant="body2" onClick={() => { Cookies.remove("GPSmoduleDisabled"); setGpsModule(true) }} style={{ padding: '2px', width: '150px', margin: '0 auto', color: 'rgb(66,133,235)', textDecoration: 'underline', fontSize: '11px' }}>Use Mobile GPS module</Typography>
                                    }
                                </>
                            )}
                    </Grid>

                    <Grid item xs={12} sm={6} style={matchesSM ? { paddingTop: "43px" } : {}}>
                        <CssTextField
                            autoComplete="newcourse"
                            id="outlined-basic"
                            label="name"
                            variant="outlined"
                            size="small"
                            type="text"
                            name="data.name"
                            inputRef={register()}
                        />
                    </Grid>


                    <Grid item xs={12} >
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={classes.buttonBgc}
                            endIcon={<SendTwoToneIcon />}
                        >
                            enter
                        </Button>
                    </Grid>

                </Grid>
            </form>
        </Paper>
    );

    return (
        <>
            {renderRedirect()}
            <Grid className={classes.GridContainer}
                container
                spacing={5}
                justify="center"
                alignItems="center"
            >
                <Grid item xs={12} md={8} lg={6} xl={5}>
                    <LoadingComponent isLoadeing={isLoading} />
                    {isFormAvaliable === false ? <FormDisable disableFormProps={disableFormProps} /> : <Form />}
                </Grid>
                <Allert
                    allert={allert}
                    setAllert={setAllert} />
            </Grid>
        </>
    );
}

export default NewWaypoint;