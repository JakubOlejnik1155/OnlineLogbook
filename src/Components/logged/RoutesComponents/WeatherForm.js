import React from 'react';
import { Redirect } from 'react-router-dom';
import { Grid, Paper, Typography, useMediaQuery, Button, Select, MenuItem } from '@material-ui/core';
import SendTwoToneIcon from '@material-ui/icons/SendTwoTone';
import { useForm, Controller } from 'react-hook-form';


import { useStyles, CssTextField } from './constants/styleObject';
import Allert from './components/Allert';
import LoadingComponent from './components/LoadingComponent';
import { PostRequestFunction, unauthorizedLogOut, GetRequestFunction } from './constants/functions';
import AuthApi from '../../../authAPI';
import FormDisable from './components/FormDisable';


const defaultValues = {
    data:{
        overcast: 0,
    }
};

const WeatherForm = () => {
    const Auth = React.useContext(AuthApi);
    const classes = useStyles();
    const {register, handleSubmit, control} = useForm({defaultValues});
    const matchesXS = useMediaQuery('(max-width:600px)');

    const [isLoading, setIsLoading] = React.useState(true);
    const [isRedirection, setIsRedirection] = React.useState(false);
    const [isFormAvaliable, setIsFormAvaliable] = React.useState(undefined);
    const [disableFormProps, setDisableFormProps] = React.useState({ msg1: '', link: '', linkMsg: '', msg2: '' });
    const [allert, setAllert] = React.useState({
        open: false,
        variant: 'filled',
        duration: 4000,
        type: 'success',
        title: 'success',
        msg: 'success msg',
    });

    React.useEffect(() => {
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
                                    msg2: 'before add weather entry'
                                });
                                setIsFormAvaliable(false);
                                setIsLoading(false)
                            }
                        }
                    })
        } catch (error) { console.log(error) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const renderRedirect = () => {
        if (isRedirection) {
            return <Redirect to='/dashboard' />
        }
    };

    const onSubmit = (values) => {
        if (values.data.temperature === '' || values.data.pressure === '')
        return setAllert({ ...allert, open: true, msg: 'fill all required inputs marked by *', title: 'bad inputs', type: 'error' })

        let temperature = parseFloat(values.data.temperature.replace(',', '.'));
        for (let i = 0; i < values.data.temperature.length; i++) {
            const code = values.data.temperature.charAt(i).charCodeAt(0);
            if ((code < 48 && code !== 46 && code !== 44) || code > 57)
            temperature = NaN;
        }
        if (isNaN(temperature)) return setAllert({ ...allert, open: true, type: 'error', title: 'invalid LOG', msg: 'please enter valid LOG' });
        else values.data.temperature = temperature;

        let pressure = parseFloat(values.data.pressure.replace(',', '.'));
        for (let i = 0; i < values.data.pressure.length; i++) {
            const code = values.data.pressure.charAt(i).charCodeAt(0);
            if ((code < 48 && code !== 46 && code !== 44) || code > 57)
            pressure = NaN;
        }
        if (isNaN(pressure)) return setAllert({ ...allert, open: true, type: 'error', title: 'invalid LOG', msg: 'please enter valid LOG' });
        else values.data.pressure = pressure;

        //hour round
        let hour = new Date().getHours();
        const minutes = new Date().getMinutes();
        if (minutes >= 30) {
            if (hour === 23) hour = 0
            else hour += 1;
        }
        values.data.hour = hour;
        try{
            setIsLoading(true);
            PostRequestFunction('/api/days/weather', values)
                .then(response => {
                    if (response.error && response.error.code === 401) {
                        setAllert({ ...allert, open: true, type: 'error', title: response.error.code, msg: response.error.msg })
                        setTimeout(() => {
                            Auth.setAuth(false);
                            unauthorizedLogOut();
                        }, 3000)
                    }else {
                        if (response.error) {
                            setIsLoading(false);
                            return setAllert({ ...allert, open: true, type: 'warning', title: response.error.code, msg: response.error.msg })
                        }
                        else if (response.success) {
                            setIsLoading(false);
                            setAllert({ ...allert, open: true, type: 'success', title: 'success', msg: 'weather entry was added!' });
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
                        <Typography variant="h5">Weather Entry {new Date().toLocaleTimeString()}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                        <CssTextField
                            autoComplete="newTemperature"
                            id="outlined-basic"
                            label="temperature* °C"
                            variant="outlined"
                            size="small"
                            type="text"
                            name="data.temperature"
                            inputRef={register()}
                        />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                        <CssTextField
                            autoComplete="newPressure"
                            id="outlined-basic"
                            label="pressure* hPa"
                            variant="outlined"
                            size="small"
                            type="text"
                            name="data.pressure"
                            inputRef={register()}
                        />
                    </Grid>


                    <Grid item xs={12} sm={5}>
                        <Typography variant="overline" style={{ marginRight: '10px', color: 'rgb(66,133,235)' }} >overcast*</Typography>
                        <Controller
                            as={
                                <Select>
                                    <MenuItem value={0}>zero</MenuItem>
                                    <MenuItem value={10}>changing</MenuItem>
                                    <MenuItem value={0.25}>1/4</MenuItem>
                                    <MenuItem value={0.5}>1/2</MenuItem>
                                    <MenuItem value={0.75}>3/4</MenuItem>
                                    <MenuItem value={1}>full</MenuItem>
                                </Select>
                            }
                            name="data.overcast"
                            control={control}
                        />
                    </Grid>


                    <Grid item xs={12} sm={5}>
                        <CssTextField
                            autoComplete="newPressure"
                            id="outlined-basic"
                            label="details"
                            variant="outlined"
                            multiline
                            size="small"
                            type="text"
                            name="data.details"
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

export default WeatherForm;