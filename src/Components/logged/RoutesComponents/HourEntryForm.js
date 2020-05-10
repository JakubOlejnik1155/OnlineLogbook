import React from 'react';
import { Redirect } from 'react-router-dom';
import { Grid, Paper, Typography, Button, Select, MenuItem, Input } from '@material-ui/core';
import SendTwoToneIcon from '@material-ui/icons/SendTwoTone';
import { useForm, Controller } from 'react-hook-form';
import CoordinateInput from "react-coordinate-input";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useMobileDetect from 'use-mobile-detect-hook';


import AuthApi from '../../../authAPI';
import Allert from './components/Allert';
import { useStyles } from './constants/styleObject'
import LoadingComponent from './components/LoadingComponent';
import { CssTextField } from './constants/styleObject';
import { convertDMS, PostRequestFunction, unauthorizedLogOut, GetRequestFunction } from './constants/functions';
import FormDisable from './components/FormDisable';

const defaultValues= {
    data:{
        windDirection: 'N',
        windSpeed: 0,
        seaState: 0
    }
}

const HourEntryForm = (props) => {
    const Auth = React.useContext(AuthApi);
    const detectMobile = useMobileDetect();
    const matchesSM = useMediaQuery('(min-width:600px)');
    const matchesXS = useMediaQuery('(max-width:600px)');
    const { register, handleSubmit, control } = useForm({ defaultValues });
    const [isRedirection, setIsRedirection] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isFormAvaliable, setIsFormAvaliable] = React.useState(undefined);
    const [disableFormProps, setDisableFormProps] = React.useState({ msg1: '', link: '', linkMsg: '', msg2: '' });
    const classes = useStyles();
    let position = {
        lat: 0,
        lng: 0
    };
    const [mobilePosition, setMobilePosition] = React.useState({
        lat: 0,
        lng: 0
    })

    React.useEffect(()=>{
        try{
            //TODO: delete timeout before production
            setTimeout(()=>{
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
            }, 1000)
        }catch(error){console.log(error)}
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const handleGpsPositionChange = (e, { dd, dms, dmsArray }) => {
        position.lat = dd[0];
        position.lng = dd[1];

    };
    const [allert, setAllert] = React.useState({
        open: false,
        variant: 'filled',
        duration: 4000,
        type: 'success',
        title: 'success',
        msg: 'success msg',
    });
    const renderRedirect = () => {
        if (isRedirection) {
            return <Redirect to='/dashboard' />
        }
    };

    const onSubmit = (values) => {

        // required validation must have inputs
        if(values.data.log === '' || values.data.longitude === 0 || values.data.latitude === 0)
            return setAllert({ ...allert, open: true, msg: 'fill all required inputs marked by *', title: 'bad inputs', type: 'error' })
        if (detectMobile.isMobile()){
            values.data.latitude = mobilePosition.lat;
            values.data.longitude = mobilePosition.lng;
        }else{
            values.data.latitude = position.lat;
            values.data.longitude = position.lng;
        }
        //compas course validation
        if (values.data.compasCourse < 0 || values.data.compasCourse > 360 || isNaN(parseInt(values.data.compasCourse)) )
            return setAllert({ ...allert, open: true, type: 'error', title: 'invalid course', msg: 'please enter valid Compas Course' });
        else values.data.compasCourse = parseInt(values.data.compasCourse)
        // boat speed validation
        let boatSpeed = parseFloat(values.data.boatSpeed.replace(',','.'));
        for (let i = 0; i < values.data.boatSpeed.length; i++) {
            const code = values.data.boatSpeed.charAt(i).charCodeAt(0);
            if ((code < 48 && code !== 46 && code !== 44) || code > 57)
                boatSpeed = NaN;
        }
        if (isNaN(boatSpeed)) return setAllert({ ...allert, open: true, type: 'error', title: 'invalid nput', msg: 'please enter valid boat speed' });
        else values.data.boatSpeed = boatSpeed;
        //LOG validation
        let LOG = parseFloat(values.data.log.replace(',','.'));
        for(let i = 0 ; i < values.data.log.length ; i++){
            const code = values.data.log.charAt(i).charCodeAt(0);
            if((code < 48 && code !== 46 && code !== 44 )||code > 57 )
                LOG = NaN;
        }
        if (isNaN(LOG)) return setAllert({ ...allert, open: true, type: 'error', title: 'invalid LOG', msg: 'please enter valid LOG' });
        else values.data.log = LOG;

        //hour round
        let hour = new Date().getHours();
        const minutes = new Date().getMinutes();
        if(minutes >= 30) {
            if (hour === 23 ) hour = 0
            else hour += 1;
        }
        values.data.hour = hour;
        try{
            detectMobile.isMobile() && window.scrollTo(0,0);
            setIsLoading(true);
            PostRequestFunction('/api/days/hourly',values)
                .then(response => {
                    if (response.error && response.error.code === 401) {
                        setAllert({ ...allert, open: true, type: 'error', title: response.error.code, msg: response.error.msg })
                        setTimeout(() => {
                            Auth.setAuth(false);
                            unauthorizedLogOut();
                        }, 3000)
                    }else{
                        if (response.error) {
                            setIsLoading(false);
                            return setAllert({ ...allert, open: true, type: 'warning', title: response.error.code, msg: response.error.msg })
                        }
                        else if (response.success) {
                            setIsLoading(false);
                            setAllert({ ...allert, open: true, type: 'success', title: 'success', msg: 'hour entry was added!' });
                            setTimeout(() => setIsRedirection(true), 4000);
                        }
                        else {
                            setIsLoading(false);
                            setAllert({ ...allert, open: true, type: 'info', title: 'error: 500', msg: 'it looks that something went wrong maybe try again?' });
                        }
                    }
                })

        }catch(error){
            setIsLoading(false);
            setAllert({ ...allert, open: true, type: 'error', title: 'error: 500', msg: 'it looks that something went wrong maybe try again?' });
        }
    };

    const getGPSHandler = async() => {
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(pos => {
                setMobilePosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            });
        }
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
                        <Typography variant="h5">Hour Entry {new Date().toLocaleTimeString()}</Typography>
                    </Grid>


                    <Grid item xs={12} sm={5}>
                        {detectMobile.isMobile() ? (
                            <>
                                <Input value={convertDMS(mobilePosition.lat, mobilePosition.lng)} style={{ width: '80%' }} inputProps={{ min: 0, style: { textAlign: 'center' } }} />
                                <Button onClick={getGPSHandler}
                                    variant="outlined"
                                    color="secondary"
                                    style={{marginTop: '10px'}}
                                   > first click to get position*</Button>
                                <Typography variant="body2" style={{color: 'gray', fontSize: '11px'}}>this may take a while</Typography>
                            </>
                        ) : (
                            <>
                                <Typography variant="overline" style={{ width: '100%', display: 'block' }}>GPS position*</Typography>
                                <CoordinateInput onChange={handleGpsPositionChange} className={classes.GPSInput} />
                            </>
                        )}
                    </Grid>

                    <Grid item xs={12} sm={6} style={matchesSM ? {paddingTop: "43px"} : {}}>
                        <CssTextField
                            autoComplete="newcourse"
                            id="outlined-basic"
                            label="Compas Course*"
                            variant="outlined"
                            size="small"
                            type="number"
                            name="data.compasCourse"
                            inputRef={register()}
                        />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <CssTextField
                            autoComplete="newsailsState"
                            id="outlined-basic"
                            label="sails state"
                            variant="outlined"
                            size="small"
                            type="text"
                            name="data.sailsState"
                            inputRef={register()}
                        />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <CssTextField
                            autoComplete="newengineState"
                            id="outlined-basic"
                            label="engine state"
                            variant="outlined"
                            size="small"
                            type="text"
                            name="data.engineState"
                            inputRef={register()}
                        />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <CssTextField
                            autoComplete="newboatspeed"
                            id="outlined-basic"
                            label="speed (knt)"
                            variant="outlined"
                            size="small"
                            type="text"
                            name="data.boatSpeed"
                            inputRef={register()}
                        />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <CssTextField
                            autoComplete="newLog"
                            id="outlined-basic"
                            label="log*"
                            variant="outlined"
                            size="small"
                            type="text"
                            name="data.log"
                            inputRef={register()}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="overline" style={{ marginRight: '10px', color:'rgb(66,133,235)' }} >Wind direction</Typography>
                        <Controller
                            as={
                                <Select>
                                    <MenuItem value="N">N</MenuItem>
                                    <MenuItem value="NE">NE</MenuItem>
                                    <MenuItem value="E">E</MenuItem>
                                    <MenuItem value="SE">SE</MenuItem>
                                    <MenuItem value="S">S</MenuItem>
                                    <MenuItem value="SW">SW</MenuItem>
                                    <MenuItem value="W">W</MenuItem>
                                    <MenuItem value="NW">NW</MenuItem>
                                </Select>
                            }
                            name="data.windDirection"
                            control={control}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography variant="overline" style={{ marginRight: '10px', color: 'rgb(66,133,235)'}} >Wind speed in &deg;B</Typography>
                        <Controller
                            as={
                                <Select>
                                    <MenuItem value={0}>0</MenuItem>
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={3}>3</MenuItem>
                                    <MenuItem value={4}>4</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={6}>6</MenuItem>
                                    <MenuItem value={7}>7</MenuItem>
                                    <MenuItem value={8}>8</MenuItem>
                                    <MenuItem value={9}>9</MenuItem>
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={11}>11</MenuItem>
                                    <MenuItem value={12}>12</MenuItem>
                                </Select>
                            }
                            name="data.windSpeed"
                            control={control}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography variant="overline" style={{marginRight: '10px', color:'rgb(66,133,235)'}}>sea state scale</Typography>
                        <Controller
                            as={
                                <Select>
                                    <MenuItem value={0}>0</MenuItem>
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={3}>3</MenuItem>
                                    <MenuItem value={4}>4</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={6}>6</MenuItem>
                                    <MenuItem value={7}>7</MenuItem>
                                    <MenuItem value={8}>8</MenuItem>
                                    <MenuItem value={9}>9</MenuItem>
                                </Select>
                            }
                            name="data.seaState"
                            control={control}
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

export default HourEntryForm;