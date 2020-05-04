import React from 'react';
import Grid from '@material-ui/core/Grid'
import { Paper, Typography, Button, Switch, withStyles} from '@material-ui/core';
import { CssTextField } from './constants/styleObject';
import SendTwoToneIcon from '@material-ui/icons/SendTwoTone';
import { useForm, Controller} from 'react-hook-form';
import {useStyles} from './constants/styleObject'
import {StyledSlider} from './components/StyledSlider';

const defaultValues = {
    day:{
        oil: false,
        fuel: 50,
        freshWater: 50,
    },
};


const NewCruiseform = () => {
    const classes = useStyles();

    const { register, handleSubmit, control } = useForm({ defaultValues });

    const onSubmit =(values) => {
        values.day.date = new Date().toJSON();
        console.log(JSON.stringify(values));
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
                        <Typography variant="overline"> optional stuff level</Typography>
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

    return (
        <Grid className={classes.GridContainer}
            container
            spacing={5}
            justify="center"
            alignItems="center"
        >
            <Grid item xs={12} md={8} lg={6} xl={4}>
               <Form/>
            </Grid>
        </Grid>
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