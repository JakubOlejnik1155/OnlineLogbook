import React, {useEffect, useContext} from 'react';
import 'date-fns';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { TextField, Button, Typography } from '@material-ui/core';
import SendTwoToneIcon from '@material-ui/icons/SendTwoTone';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { countryList } from './constants/countres';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Allert from './components/Allert';
import { useForm } from 'react-hook-form';
import { Link, Redirect } from 'react-router-dom';
import { useStyles, CssTextField} from './constants/styleObject';
import AuthApi from "../../../authAPI";
import { countryToFlag, unauthorizedLogOut, GetRequestFunction, PostRequestFunction } from './constants/functions';
import LoadingComponent from './components/LoadingComponent';

const NewCruiseform = (props) => {
    const Auth = useContext(AuthApi);
    const classes = useStyles();
    const { handleSubmit, register } = useForm();
    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const [isFormAvialiable, setIsFormAvialiable] = React.useState(undefined);
    const [isLoadeing, setIsLoading] = React.useState(true);
    const [isRedirection, setIsRedirection] = React.useState(false);
    const renderRedirect = () => {
        if (isRedirection) {
            return <Redirect to='/dashboard' />
        }
    }
    const [allert, setAllert] = React.useState({
        open: false,
        variant: 'filled',
        duration: 4000,
        type: 'success',
        title: 'success',
        msg: 'success msg',
    })
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const onSubmit = (values, event) =>{

        values.cruise.startDate = new Date().toJSON();
        const {boat, cruise} = values;
        if (boat.name === '' || boat.MMSI === '' || cruise.country === '' || cruise.sailingArea === '' || cruise.harbour === ''){
            return setAllert({...allert, open: true, msg: 'fill all required inputs marked by *', title: 'bad inputs', type: 'error'})
        }
        if(!/^[0-9]{9}$/.test(boat.MMSI))
            return setAllert({...allert, open: true, type: 'warning', title: "incorrect MMSI", msg: "MMSI number have nine digits" })
        try{
            setIsLoading(true);
            PostRequestFunction('/api/cruises', values)
                .then(response => {
                    //unauthorized
                    if (response.error && response.error.code === 401) {
                        setAllert({ ...allert, open: true, type: 'error', title: response.error.code, msg: response.error.msg })
                        setTimeout(() => {
                             Auth.setAuth(false);
                            unauthorizedLogOut();
                        }, 3000)
                    }else{
                        if(response.error){
                            setIsLoading(false);
                            return setAllert({ ...allert, open: true, type: 'warning', title: response.error.code, msg: response.error.msg })
                        }
                        else if (response.success){
                            setIsLoading(false);
                            setAllert({ ...allert, open:true,type:'success', title: 'success', msg: 'cruise was created'});
                            setTimeout(()=>setIsRedirection(true), 4000);
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

    useEffect(()=>{
        try{
            //TODO: delete timeout before production
            setTimeout(()=>{
                GetRequestFunction("/api/cruises/current")
                    .then(response => {
                        //unauthorized
                        if(response.error && response.error.code === 401){
                            console.log('unauthorized');
                            setAllert({ ...allert, open: true, type: 'error', title: response.error.code, msg: response.error.msg })
                            setTimeout(() => {
                                Auth.setAuth(false);
                                unauthorizedLogOut();
                            },3000)
                        }else{
                        //
                            if (response.data.length === 1) {
                                setIsFormAvialiable(false);
                                setIsLoading(false)
                            }
                            else {
                                setIsFormAvialiable(true);
                                setIsLoading(false)
                            }
                        }
                    })
            }, 1000)
        }catch(error){console.log(error)}
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const Form = () =>(
        <Paper className={classes.paper}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid className={classes.GridContainer}
                container
                spacing={3}
                justify="center"
                alignItems="center"
            >
                <Grid item xs={12} style={{ borderBottom: '1px solid black', paddingTop: '0px' }}>
                    <Typography variant="h5">Start cruise</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="overline">geographical data</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <CssCountryPick
                        id="combo-box-demo"
                        options={countryList}
                        getOptionLabel={(option) => option.label}
                            renderOption={option => (
                                <span>
                                    {countryToFlag(option.code)}
                                    {option.label}
                                </span>
                            )}
                        size="small"
                        style={{ maxWidth: '194px', margin: '0 auto' }}
                        renderInput={(params) => <TextField
                            {...params}
                            name="cruise.country"
                            label="country*"
                            variant="outlined"
                            inputRef={register()}
                        />}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <CssTextField
                        autoComplete="new"
                        id="outlined-basic"
                        label="sailing area*"
                        variant="outlined"
                        size="small"
                        inputRef={register()}
                        name="cruise.sailingArea"

                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <CssTextField
                        autoComplete="new"
                        id="outlined-basic"
                        label="starting harbor*"
                        variant="outlined"
                        size="small"

                        name="cruise.harbour"
                        inputRef={register()}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <CssDatePick
                            id="date-picker-dialog"
                            label="start date"
                            size="small"
                            disabled
                            format="MM/dd/yyyy"
                            value={selectedDate}
                            onChange={handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            name="cruise.startDate"
                            inputRef={register()}
                        />
                    </MuiPickersUtilsProvider>
                </Grid>

                <Grid item xs={12} style={{ borderBottom: '1px solid black' }}></Grid>

                <Grid item xs={12}>
                    <Typography variant="overline">boat data</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <CssTextField
                        autoComplete="new"
                        id="outlined-basic"
                        label="name*"
                        variant="outlined"
                        size="small"
                        name="boat.name"
                        inputRef={register()}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <CssTextField
                        autoComplete="new"
                        id="outlined-basic"
                        label="type and length"
                        variant="outlined"
                        size="small"
                        name="boat.type"
                        inputRef={register()}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <CssTextField
                        autoComplete="new"
                        id="outlined-basic"
                        label="MMSI number*"
                        variant="outlined"
                        size="small"
                        name="boat.MMSI"
                        inputRef={register()}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <CssTextField
                        autoComplete="new"
                        id="outlined-basic"
                        label="draft"
                        variant="outlined"
                        size="small"

                        name="boat.draft"
                        inputRef={register()}
                    />
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
        </Paper >
    );

    const FormDisable = () => (
        <Paper className={classes.paper}>
            <Grid className={classes.GridContainer}
                container
                spacing={3}
                justify="center"
                alignItems="center"
            >
                <Grid item xs={12} >
                    <p>Oops! It looks like you've already started a cruise. </p>
                    <p><Link to="/dashboard/finish/cruise" style={{ color: 'rgb(66,133,235)', textDecoration: 'underline'}}>Finish it</Link> before starting the next one</p>
                </Grid>
            </Grid>
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
                <Grid item xs={12} md={8} lg={6} xl={4}>
                    <LoadingComponent isLoadeing={isLoadeing}/>
                    {isFormAvialiable === false ? <FormDisable /> : <Form/>}
                </Grid>
                <Allert
                    allert={allert}
                    setAllert={setAllert}/>
            </Grid>
        </>
     );
};

const CssCountryPick = withStyles({
    root: {
        '& label.Mui-focused': {
            color: 'rgb(66,133,235)',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: 'rgb(66,133,235)',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'rgb(66,133,235)',
                borderWidth: 1.5,

            },
            '&:hover fieldset': {
                borderColor: 'rgb(66,133,235)',
            },
            '&.Mui-focused fieldset': {
                borderColor: 'rgb(66,133,235)',
            },
        },
    },
})(Autocomplete);
const CssDatePick = withStyles({
    root: {
        borderBottomColor: 'rgb(66,133,235)',
        width: '194px',
        '& .MuiSvgIcon-root': {
            fill: 'rgb(66,133,235)',
        },
        '& label.Mui-focused': {
            color: 'rgb(66,133,235)',
        },
        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
            borderBottomColor: 'rgb(66,133,235)',
        },
        '& .MuiInput-underline': {
            borderBottomColor: 'rgb(66,133,235)',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: 'rgb(66,133,235)',
        },
        '& .MuiInput-underline:before': {
            borderBottomColor: 'rgb(66,133,235)',
            borderWidth: 1.5,
        }
    },
})(KeyboardDatePicker);

export default NewCruiseform;