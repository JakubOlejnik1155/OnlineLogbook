import React, {useEffect} from 'react';
import 'date-fns';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { TextField, Button, Typography } from '@material-ui/core';
import SendTwoToneIcon from '@material-ui/icons/SendTwoTone';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { countryList } from './components/countres';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Allert from './components/Allert';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Cookies from 'js-cookie';
import connections from '../../connections';

const NewCruiseform = (props) => {
    const classes = useStyles();
    const { handleSubmit, register } = useForm();
    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const [isFormAvialiable, setIsFormAvialiable] = React.useState(undefined);
    const [isLoadeing, setIsLoading] = React.useState(true);
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
        const postCruise = async () =>{
            const token = Cookies.get('RefreshToken');
            const options = {
                method: 'POST',
                headers: {
                    'authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            }
            const response = await fetch(connections.server.concat('/api/cruises'), options);
            return response.json();
        }
        const {boat, cruise} = values;
        if (boat.name === '' || boat.MMSI === '' || cruise.country === '' || cruise.sailingArea === '' || cruise.harbour === ''){
            return setAllert({...allert, open: true, msg: 'fill all required inputs marked by *', title: 'bad inputs', type: 'error'})
        }
        if(!/^[0-9]{9}$/.test(boat.MMSI))
            return setAllert({...allert, open: true, type: 'warning', title: "incorrect MMSI", msg: "MMSI number have nine digits" })
        try{
            setIsLoading(true);
            postCruise()
                .then(response => {
                    if(response.error){
                        setIsLoading(false);
                        return setAllert({ ...allert, open: true, type: 'warning', title: response.error.code, msg: response.error.msg })
                    }
                    else if (response.success){
                        setIsLoading(false);
                        setAllert({ ...allert, open:true,type:'success', title: 'success', msg: 'cruise was created'});
                    }
                    else {
                        setIsLoading(false);
                        setAllert({ ...allert, open: true, type: 'info', title: 'error: 500', msg: 'it looks that something went wrong maybe try again?' });
                    }
                })
        }catch(error){
            setIsLoading(false);
            setAllert({ ...allert, open: true, type: 'error', title: 'error: 500', msg: 'it looks that something went wrong maybe try again?' });
        }
    };


    useEffect(()=>{
        //check if user have been already started a cruise
        const CheckCurrentCruise = async () => {
            const token = Cookies.get('RefreshToken');
            const options = {
                method: 'GET',
                headers:{
                    'authorization':`Bearer ${token}`
                }
            };
            const response = await fetch(connections.server.concat('/api/cruises/current'), options);
            return response.json();
        }

        try{
            //TODO: delete timeout before production
            setTimeout(()=>{
                CheckCurrentCruise()
                    .then(response => {
                        if (response.data.length === 1) {
                            setIsFormAvialiable(false);
                            setIsLoading(false)
                        }
                        else {
                            setIsFormAvialiable(true);
                            setIsLoading(false)
                        }
                    })
            }, 1000)
        }catch(error){console.log(error)}

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
                        getOptionLabel={(option) => option}
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
                    <p><Link to="/dashboard/finish/cruise" style={{color: 'rgb(66,133,235)'}}>Finish it</Link> before starting the next one</p>
                </Grid>
            </Grid>
        </Paper>
    );

    const LoadingComponent = () => (
        <Backdrop className={classes.backdrop} open={isLoadeing}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );

    return (
        <Grid className={classes.GridContainer}
            container
            spacing={5}
            justify="center"
            alignItems="center"
        >
            <Grid item xs={12} md={8} lg={6} xl={4}>
                <LoadingComponent />
                {isFormAvialiable === false ? <FormDisable /> : <Form/>}
            </Grid>
            <Allert
                allert={allert}
                setAllert={setAllert}/>
        </Grid>
     );
};

//styles components
const useStyles = makeStyles((theme) => ({
    GridContainer: {
        width: '100%',
        margin: 0,
    },
    noBottomMargin:{
        marginBottom: 0,
        padding: '0px !important'
    },
    paper: {
        padding: "1vw",
        textAlign: "center",
        color: "black",
        whiteSpace: "wrap",
        background: "rgba(255, 255, 255, .9)",
    },
    buttonBgc: {
        backgroundColor: 'rgb(66,133,235)',
        '&:hover': {
            backgroundColor: 'rgb(26,107,230)',
        },
    },
    backdrop: {
        marginTop: '60px',
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
        '& .MuiCircularProgress-root':{
            width: '70px !important',
            height: '70px !important',
        }
    },
}))
const CssTextField = withStyles({
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
})(TextField);
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