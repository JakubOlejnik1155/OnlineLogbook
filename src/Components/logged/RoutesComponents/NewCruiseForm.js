import React from 'react';
import 'date-fns';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { TextField, Button, Typography } from '@material-ui/core';
import SendTwoToneIcon from '@material-ui/icons/SendTwoTone';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { countryList } from './data/countres';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { useForm } from 'react-hook-form';


const NewCruiseform = () => {
    const classes = useStyles();
    const { handleSubmit, register, errors } = useForm();
    const [selectedDate, setSelectedDate] = React.useState(new Date());

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const onSubmit = (values, event) =>{
        console.log(values);
        event.target.reset();
    };


    return (
        <Grid className={classes.GridContainer}
            container
            spacing={5}
            justify="center"
            alignItems="center"
        >
            <Grid item xs={12} md={8} lg={6} xl={4}>
                <Paper className={classes.paper}>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid className={classes.GridContainer}
                            container
                            spacing={3}
                            justify="center"
                            alignItems="center"
                        >
                            <Grid item xs={12} style={{borderBottom: '1px solid black'}}>
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
                                    style={{maxWidth: '194px', margin: '0 auto'}}
                                    renderInput={(params) => <TextField
                                                                {...params}
                                                                name="country"
                                                                label="country*"
                                                                variant="outlined"
                                                                inputRef={register({required: "country is required"})}
                                                                error={errors.country ? true : false}
                                                                helperText={errors.country ? errors.country.message : " "}
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
                                    name="sailingArea"
                                    inputRef={register({required: "sailing area is required"})}
                                    error={errors.sailingArea ? true : false}
                                    helperText={errors.sailingArea ? errors.sailingArea.message : " "}

                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <CssTextField
                                    autoComplete="new"
                                    id="outlined-basic"
                                    label="starting harbor*"
                                    variant="outlined"
                                    size="small"

                                    name="harbour"
                                    inputRef={register({required: "harbour is required"})}
                                    error={errors.harbour ? true : false}
                                    helperText={errors.harbour ? errors.harbour.message : " "}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <CssDatePick
                                        id="date-picker-dialog"
                                        label="date"
                                        size="small"
                                        format="MM/dd/yyyy"
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                        name="date"
                                        inputRef={register()}
                                        helperText=" "
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
                                    inputRef={register({ required: "name is required" })}
                                    error={errors.boat && errors.boat.name ? true : false}
                                    helperText={(errors.boat && errors.boat.name) ? errors.boat.name.message : " "}
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
                                    helperText=" "
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
                                    inputRef={register({
                                        required: "MMSI number is required",
                                        pattern:{
                                            value: /^[0-9]{9}$/,
                                            message: "enter a valid MMSI number"
                                        }
                                    })}
                                    error={errors.boat && errors.boat.MMSI  ? true : false}
                                    helperText={(errors.boat && errors.boat.MMSI) ? errors.boat.MMSI.message : " "}
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
                                    helperText=" "
                                />
                            </Grid>

                            <Grid item xs={12}>
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
            </Grid>
        </Grid>
     );
}

//styles components
const useStyles = makeStyles((theme) => ({
    GridContainer: {
        width: '100%',
        margin: 0,
    },
    paper: {
        padding: "2vw",
        textAlign: "center",
        color: "black",
        whiteSpace: "nowrap",
        background: "rgba(255, 255, 255, .9)",
    },
    buttonBgc: {
        backgroundColor: 'rgb(66,133,235)',
        '&:hover': {
            backgroundColor: 'rgb(26,107,230)',
        },
    }
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