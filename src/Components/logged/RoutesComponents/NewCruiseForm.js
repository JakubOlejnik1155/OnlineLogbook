import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { TextField, Button, Typography } from '@material-ui/core';
import SendTwoToneIcon from '@material-ui/icons/SendTwoTone';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { countryList } from './data/countres';

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


const NewCruiseform = () => {
    const classes = useStyles();
    return (
        <Grid className={classes.GridContainer}
            container
            spacing={5}
            justify="center"
            alignItems="center"
        >
            <Grid item xs={12} md={8} lg={6} xl={4}>
                <Paper className={classes.paper}>

                    <form>
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
                                {/* <CssTextField
                                    autoComplete="new"
                                    id="outlined-basic"
                                    label="country*"
                                    variant="outlined"
                                    size="small"

                                    name="country"
                                    //error
                                    //helperText="input required"
                                /> */}
                                <CssCountryPick
                                    id="combo-box-demo"
                                    name="country"
                                    options={countryList}
                                    getOptionLabel={(option) => option}
                                    size="small"
                                    style={{maxWidth: '194px', margin: '0 auto'}}
                                    renderInput={(params) => <TextField {...params} label="country*" variant="outlined" />}
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
                                    //error
                                    //helperText="input required"
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
                                //error
                                //helperText="input required"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <CssTextField
                                    autoComplete="new"
                                    id="outlined-basic"
                                    label="date*"
                                    variant="outlined"
                                    size="small"

                                    name="date"
                                    //error
                                    //helperText="input required"
                                />
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

                                    name="name"
                                //error
                                //helperText="input required"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <CssTextField
                                    autoComplete="new"
                                    id="outlined-basic"
                                    label="type*"
                                    variant="outlined"
                                    size="small"

                                    name="type"
                                //error
                                //helperText="input required"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <CssTextField
                                    autoComplete="new"
                                    id="outlined-basic"
                                    label="slength*"
                                    variant="outlined"
                                    size="small"

                                    name="length"
                                //error
                                //helperText="input required"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <CssTextField
                                    autoComplete="new"
                                    id="outlined-basic"
                                    label="draft*"
                                    variant="outlined"
                                    size="small"

                                    name="draft"
                                //error
                                //helperText="input required"
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

export default NewCruiseform;