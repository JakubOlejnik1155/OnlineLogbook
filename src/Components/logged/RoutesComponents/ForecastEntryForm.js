import React, { useContext } from 'react';
import { Grid, Paper, Typography, Button } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import SendTwoToneIcon from '@material-ui/icons/SendTwoTone';


import AuthApi from '../../../authAPI';
import Allert from './components/Allert';
import { useStyles } from './constants/styleObject'
import LoadingComponent from './components/LoadingComponent';
import { CssTextField } from './constants/styleObject';
import { PostRequestFunction, unauthorizedLogOut, GetRequestFunction } from './constants/functions';
import FormDisable from './components/FormDisable';
import { useForm } from 'react-hook-form';


const ForecastEntryForm = () => {
    const classes = useStyles();
    const Auth = useContext(AuthApi);
    const matchesXS = useMediaQuery('(max-width:600px)');
    const { register, handleSubmit } = useForm();
    const [isLoading, setIsLoading] = React.useState(true);
    const [isFormAvaliable, setIsFormAvaliable] = React.useState(undefined);
    const [disableFormProps, setDisableFormProps] = React.useState({ msg1: '', link: '', linkMsg: '', msg2: '' });
    const [isRedirection, setIsRedirection] = React.useState(false);
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
            //TODO: delete timeout before production
            setTimeout(() => {
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
                                    msg2: 'before add forecast'
                                });
                                setIsFormAvaliable(false);
                                setIsLoading(false)
                            }
                        }
                    })
            }, 1000)
        } catch (error) { console.log(error) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const renderRedirect = () => {
        if (isRedirection) {
            return <Redirect to='/dashboard' />
        }
    };

    const onSubmit = (values) => {
        if (values.data.forecast === '')
            return setAllert({ ...allert, open: true, msg: 'set forecast ', title: 'unknown type', type: 'error' })
        try {
            setIsLoading(true);
            PostRequestFunction('/api/days/forecast', values)
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
                            setAllert({ ...allert, open: true, type: 'success', title: 'success', msg: 'forecast was added!' });
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
                    spacing={4}
                    justify="center"
                    alignItems="center"
                >
                    <Grid item xs={12} style={matchesXS ? { borderBottom: '1px solid black' } : { borderBottom: '1px solid black', paddingTop: '0px' }}>
                        <Typography variant="h5">Edit received forecast</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <CssTextField
                            autoComplete="newsailsState"
                            id="outlined-basic"
                            multiline
                            label="forecast"
                            variant="outlined"
                            size="small"
                            style={{width: '100%', maxWidth: '500px'}}
                            type="text"
                            name="data.forecast"
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
                            confirm
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

export default ForecastEntryForm;