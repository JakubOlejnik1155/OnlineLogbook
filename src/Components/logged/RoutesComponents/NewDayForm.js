import React, { useContext, useEffect} from 'react';
import Grid from '@material-ui/core/Grid'

import { Paper, Typography, Button, Switch, withStyles} from '@material-ui/core';
import { CssTextField } from './constants/styleObject';
import SendTwoToneIcon from '@material-ui/icons/SendTwoTone';
import { useForm, Controller} from 'react-hook-form';
import { Redirect } from 'react-router-dom';
import {useStyles} from './constants/styleObject'
import {StyledSlider} from './components/StyledSlider';
import AuthApi from '../../../authAPI';
import LoadingComponent from './components/LoadingComponent';
import Allert from './components/Allert';
import { unauthorizedLogOut, GetRequestFunction, PostRequestFunction } from './constants/functions';
import FormDisable from './components/FormDisable';

const defaultValues = {
    day:{
        oil: false,
        fuel: 50,
        freshWater: 50,
    },
};


const NewCruiseform = () => {
    const Auth = useContext(AuthApi);
    const classes = useStyles();
    const { register, handleSubmit, control } = useForm({ defaultValues });
    const [isFormAvialiable, setIsFormAvialiable] = React.useState(undefined);
    const [isLoadeing, setIsLoading] = React.useState(true);
    const [isRedirection, setIsRedirection] = React.useState(false);
    const [allert, setAllert] = React.useState({
        open: false,
        variant: 'filled',
        duration: 4000,
        type: 'success',
        title: 'success',
        msg: 'success msg',
    });
    const [disableFormProps, setDisableFormProps] = React.useState({ msg1: '', link: '', linkMsg: '', msg2: ''})


    useEffect(()=>{
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
                            //
                            if (response.error && response.error.msg === 'there is no active cruise'){
                                setDisableFormProps({
                                    msg1: "Oops! It looks like you don't have active cruise.",
                                    link: '/dashboard/start/cruise',
                                    linkMsg: 'Start it',
                                    msg2: 'before starting a day!'
                                });
                                setIsFormAvialiable(false);
                                setIsLoading(false)
                            }else if (response.data && response.data.length === 1) {
                                setDisableFormProps({
                                    msg1: "Oops! It looks like you've already started a day.",
                                    link: '/dashboard/finish/day',
                                    linkMsg: 'Finish it',
                                    msg2: 'before starting the next one'});
                                setIsFormAvialiable(false);
                                setIsLoading(false)
                            }
                            else {
                                setIsFormAvialiable(true);
                                setIsLoading(false)
                            }
                        }
                    })
            },1000)
        }catch(error){console.log(error)}
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);


    const onSubmit = (values) => {
        values.day.date = new Date().toJSON();
        const {day} = values
        console.log(day);
        if(day.startHarbour === '' || day.engineMth === ''){
            return setAllert({ ...allert, open: true, msg: 'fill all required inputs marked by *', title: 'bad inputs', type: 'error' })
        }
        try{
            setIsLoading(true);
            PostRequestFunction('/api/days', values)
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
                        if (response.error) {
                            setIsLoading(false);
                            return setAllert({ ...allert, open: true, type: 'warning', title: response.error.code, msg: response.error.msg })
                        }
                        else if (response.success) {
                            setIsLoading(false);
                            setAllert({ ...allert, open: true, type: 'success', title: 'success', msg: 'day was started. Happy Boating!' });
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


    const Form = () => (
        <Paper className={classes.paper}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid className={classes.GridContainer}
                    container
                    spacing={3}
                    justify="center"
                    alignItems="center"
                >
                    <Grid item xs={12} style={{ borderBottom: '1px solid black', paddingTop: '0px' }}>
                        <Typography variant="h5">Start Day</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="overline">mandatory data</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <CssTextField
                            autoComplete="newStartingHabrour"
                            id="outlined-basic"
                            label="starting harbor*"
                            variant="outlined"
                            size="small"
                            name="day.startHarbor"
                            inputRef={register()}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <CssTextField
                            autoComplete="newStartingHabrour"
                            id="outlined-basic"
                            label="engine Mth*"
                            variant="outlined"
                            size="small"
                            name="day.engineMth"
                            inputRef={register()}
                        />
                    </Grid>


                    <Grid item xs={12} style={{ borderBottom: '1px solid black' }}></Grid>
                    <Grid item xs={12}>
                        <Typography variant="overline"> check before sailing </Typography>
                    </Grid>

                    <Grid className={classes.GridContainer}
                        container
                        direction="column"
                        spacing={3}
                        justify="center"
                        alignItems="center">
                        <Grid item xs={12} sm={6}>
                            <Typography id="discrete-slider" gutterBottom>
                                engine oil check
                            </Typography>
                            <Controller
                                as={PurpleSwitch}
                                type="checkbox"
                                name="day.oil"
                                control={control}
                            />
                        </Grid>

                        <Grid item className={classes.rowOfColumnGrid}>
                            <Typography id="discrete-slider" gutterBottom className={classes.textAlignLeft}>
                                fuel tank
                            </Typography>
                            <Controller
                                name="day.fuel"
                                control={control}
                                onChange={([, value]) => value}
                                as={<StyledSlider valueLabelDisplay="auto" max={100} min={0} step={10} marks />}
                            />
                        </Grid>

                        <Grid item className={classes.rowOfColumnGrid}>
                            <Typography id="discrete-slider" gutterBottom className={classes.textAlignLeft}>
                                fresh water tanks
                            </Typography>
                            <Controller
                                name="day.freshWater"
                                control={control}
                                onChange={([, value]) => value}
                                as={<StyledSlider valueLabelDisplay="auto" max={100} min={0} step={10} marks />}
                            />
                        </Grid>
                    </Grid>


                    <Grid item xs={12} className={classes.noBottomMargin}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={classes.buttonBgc}
                            endIcon={<SendTwoToneIcon />}
                        >
                            sail
                    </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );

    const renderRedirect = () => {
        if (isRedirection) {
            return <Redirect to='/dashboard' />
        }
    };

    return (
        <>
            {renderRedirect()}
            <Grid className={classes.GridContainer}
                container
                spacing={5}
                justify="center"
                alignItems="center"
            >
                <Grid item xs={12} md={8} lg={6} xl={4}>
                    <LoadingComponent isLoadeing={isLoadeing} />
                    {isFormAvialiable === false ? <FormDisable disableFormProps={disableFormProps}/> : <Form />}
                </Grid>
                <Allert
                    allert={allert}
                    setAllert={setAllert} />
            </Grid>
        </>
    );
}

export default NewCruiseform;

const PurpleSwitch = withStyles({
    switchBase: {
        color: 'rgb(128,173,255)',
        '&$checked': {
            color: 'rgb(66,133,235)',
        },
        '&$checked + $track': {
            backgroundColor: 'rgb(66,133,235)',
        },
    },
    checked: {},
    track: {},
})(Switch);