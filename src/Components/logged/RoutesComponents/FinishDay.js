import React, { useContext } from 'react';
import { Grid, Paper, Typography, Button } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import HighlightOffTwoToneIcon from '@material-ui/icons/HighlightOffTwoTone';


import AuthApi from '../../../authAPI';
import Allert from './components/Allert';
import { useStyles } from './constants/styleObject'
import LoadingComponent from './components/LoadingComponent';
import { CssTextField } from './constants/styleObject';
import { PostRequestFunction, unauthorizedLogOut, GetRequestFunction } from './constants/functions';
import FormDisable from './components/FormDisable';
import { useForm } from 'react-hook-form';


const FinishDay = () => {
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
                                    msg1: "Oops! It looks like you have no active day. You need to ",
                                    link: '/dashboard/start/day',
                                    linkMsg: 'start it',
                                    msg2: 'to be able to finish it '
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

        if(values.data.endHarbor === '' || values.data.endLOG === '' )
        return setAllert({ ...allert, open: true, msg: 'fill all required inputs marked by * ', title: 'empty input', type: 'error' });

        let LOG = parseFloat(values.data.endLOG.replace(',', '.'));
        for (let i = 0; i < values.data.endLOG.length; i++) {
            const code = values.data.endLOG.charAt(i).charCodeAt(0);
            if ((code < 48 && code !== 46 && code !== 44) || code > 57)
                LOG = NaN;
        }
        if (isNaN(LOG)) return setAllert({ ...allert, open: true, type: 'error', title: 'invalid LOG', msg: 'please enter valid LOG' });
        else values.data.endLOG = LOG;

        if (values.data.marinaVHF !== ''){
            if (values.data.marinaVHF < 0 || isNaN(parseInt(values.data.marinaVHF)))
            return setAllert({ ...allert, open: true, type: 'error', title: 'invalid VHF channel', msg: 'please enter valid channel' });
            else values.data.marinaVHF = parseInt(values.data.marinaVHF)
        }else values.data.marinaVHF = 0;

        try {
            setIsLoading(true);
            PostRequestFunction('/api/days/finish', values)
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
                            setAllert({ ...allert, open: true, type: 'success', title: 'success', msg: 'day was finished!' });
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
                        <Typography variant="h5">End Sailing Day</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} >
                        <CssTextField
                            autoComplete="newStartingHabrour"
                            id="outlined-basic"
                            label="ending harbor*"
                            variant="outlined"
                            size="small"
                            name="data.endHarbor"
                            inputRef={register()}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} >
                        <CssTextField
                            autoComplete="newStartingHabrour"
                            id="outlined-basic"
                            label="end LOG*"
                            variant="outlined"
                            size="small"
                            name="data.endLOG"
                            inputRef={register()}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} >
                        <CssTextField
                            autoComplete="newStartingHabrour"
                            id="outlined-basic"
                            label="marina Charges"
                            variant="outlined"
                            size="small"
                            name="data.marinaCharges"
                            inputRef={register()}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} >
                        <CssTextField
                            autoComplete="newStartingHabrour"
                            id="outlined-basic"
                            label="marina VHF channel"
                            type="number"
                            variant="outlined"
                            size="small"
                            name="data.marinaVHF"
                            inputRef={register()}
                        />
                    </Grid>

                    <Grid item xs={12} >
                        <Button
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

export default FinishDay;