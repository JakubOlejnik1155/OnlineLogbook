import React, { useContext } from 'react';
import { Grid, Paper, Typography, Button, withStyles, Switch } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import HighlightOffTwoToneIcon from '@material-ui/icons/HighlightOffTwoTone';


import AuthApi from '../../../authAPI';
import Allert from './components/Allert';
import { useStyles } from './constants/styleObject'
import LoadingComponent from './components/LoadingComponent';
import { unauthorizedLogOut, GetRequestFunction, PatchRequestFunction } from './constants/functions';
import FormDisable from './components/FormDisable';

const FinishCruise = () => {
    const classes = useStyles();
    const Auth = useContext(AuthApi);
    const matchesXS = useMediaQuery('(max-width:600px)');
    const [isConfirmed, setIsConfirmed] = React.useState(false);
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
                                setDisableFormProps({
                                    msg1: "Oops! It looks like you have active day. You need to ",
                                    link: '/dashboard/finish/day',
                                    linkMsg: 'finish it',
                                    msg2: 'to be able to finish the whole cruise '
                                });
                                setIsFormAvaliable(false);
                                setIsLoading(false)
                            } else {
                                setIsFormAvaliable(true);
                                setIsLoading(false)
                            }
                        }
                    })
                GetRequestFunction('/api/cruises/current')
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
                                    msg1: "Oops! It looks like you have no active cruise. You need to ",
                                    link: '/dashboard/start/cruise',
                                    linkMsg: 'active it',
                                    msg2: 'to be able to finish'
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

    const onSubmit = (event) => {
        event.preventDefault();
        console.log("end cruise");
        try {
            setIsLoading(true);
            PatchRequestFunction('/api/cruises/finish')
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
                            setAllert({ ...allert, open: true, type: 'success', title: 'success', msg: 'cruise was finished!' });
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
            <form onSubmit={onSubmit}>
                <Grid className={classes.GridContainer}
                    container
                    spacing={4}
                    justify="center"
                    alignItems="center"
                >
                    <Grid item xs={12} style={matchesXS ? { borderBottom: '1px solid black' } : { borderBottom: '1px solid black', paddingTop: '0px' }}>
                        <Typography variant="h5">Finish Cruise</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1">
                        <span style={{color: 'orangered'}}>Warning! </span>
                        After closing the cruise you will no longer be able to add days and entries connected to it. Are you sure you want to finish the cruise?</Typography>
                    </Grid>
                    <PurpleSwitch checked={isConfirmed} onChange={()=> setIsConfirmed(!isConfirmed)} />

                    <Grid item xs={12} >
                        <Button
                            disabled={!isConfirmed}
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={classes.dangerButton}
                            endIcon={<HighlightOffTwoToneIcon />}
                        >
                            Finish
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

export default FinishCruise;

const PurpleSwitch = withStyles({
    switchBase: {
        color: 'orangered',
        '&$checked': {
            color: 'orangered',
        },
        '&$checked + $track': {
            backgroundColor: 'orangered',
        },
    },
    checked: {},
    track: {},
})(Switch);