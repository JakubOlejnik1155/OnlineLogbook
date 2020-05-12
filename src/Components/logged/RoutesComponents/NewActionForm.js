import React, {useContext} from 'react';
import { Grid, Paper, Typography, Select, MenuItem, Button} from '@material-ui/core';
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
import { useForm, Controller } from 'react-hook-form';

const defaultValues = {
    data: {
        actionType: 0,
    }
};

const NewActionForm = () => {
    const classes = useStyles();
    const Auth = useContext(AuthApi);
    const matchesXS = useMediaQuery('(max-width:600px)');
    const { register, handleSubmit, control } = useForm({ defaultValues});
    //TODO : change to true
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
                                    msg2: 'before add an action'
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

        if (values.data.actionType === 'other' && values.data.details === '')
            return setAllert({ ...allert, open: true, msg: 'set details for other action type', title: 'unknown type', type: 'error' })
        if (values.data.actionType === 0)
            return setAllert({ ...allert, open: true, msg: 'choose type of action', title: 'unknown type', type: 'error' })
        const hour = new Date().toJSON();
        values.data.hour = hour;

        try {
            setIsLoading(true);
            PostRequestFunction('/api/days/action', values)
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
                            setAllert({ ...allert, open: true, type: 'success', title: 'success', msg: 'action was added!' });
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
                        <Typography variant="h5">Action Entry {new Date().toLocaleTimeString()}</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                       <label>
                            <Typography variant="overline" style={{ marginRight: '10px', color: 'rgb(66,133,235)' }} >Action type *</Typography>
                        </label>
                        <Controller
                            as={
                                <Select>
                                    <MenuItem value={0} style={{ color: 'gray' }} disabled> <Typography style={{ color: 'gray' }}>choose one</Typography></MenuItem>
                                    <MenuItem value='leave'>leave berth</MenuItem>
                                    <MenuItem value="setSails">set sails + engine off</MenuItem>
                                    <MenuItem value="dropSails">drop sails + engine on</MenuItem>
                                    <MenuItem value="reef">reef Sails</MenuItem>
                                    <MenuItem value="unreefSails">unreef sails</MenuItem>
                                    <MenuItem value="engineOn">engine on</MenuItem>
                                    <MenuItem value="engineOff">engine off</MenuItem>
                                    <MenuItem value="gybe">gybe</MenuItem>
                                    <MenuItem value="tack">tack</MenuItem>
                                    <MenuItem value="anchorDrop">drop the anchor</MenuItem>
                                    <MenuItem value="mooring">mooring</MenuItem>
                                    <MenuItem value="mooringBuoy">Buoy mooring</MenuItem>
                                    <MenuItem value="other">other</MenuItem>
                                </Select>

                            }
                            name="data.actionType"
                            control={control}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <CssTextField
                            autoComplete="newsailsState"
                            id="outlined-basic"
                            multiline
                            label="details"
                            variant="outlined"
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

export default NewActionForm;