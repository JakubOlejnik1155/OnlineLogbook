import React from 'react';
import clsx from "clsx";
import { Grid, Card, CardHeader, CardMedia, CardContent, Typography, CardActions, Collapse, IconButton} from '@material-ui/core';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ReactCountryFlag from "react-country-flag"
import DeleteForeverTwoToneIcon from '@material-ui/icons/DeleteForeverTwoTone';
import GetAppTwoToneIcon from '@material-ui/icons/GetAppTwoTone';


import { useStyles } from '../constants/styleObject';
import {countryList} from '../constants/countres';

const OneCruise = ({cruise}) => {

    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const [ISO, setISO] = React.useState("US");

    React.useEffect(()=> {
        countryList.forEach(country => {
            if (country.label === cruise.country) {
                setISO(country.code);
            }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const floatToHoursPlusMinutes = (number) => {
        const hour = Math.floor(number);
        const minutes = number - hour;
        return hour+ "h "+ Math.round(60*minutes)+ "min"
    }

    return (
        <>
            <Grid item xs={12}>
                <Card className={classes.root}>
                    <CardHeader
                        avatar={
                            <ReactCountryFlag
                                className="emojiFlag"
                                countryCode={ISO}
                                style={{
                                    fontSize: '2em',
                                }}
                                aria-label="United States"
                            />
                        }
                        action={
                            <IconButton aria-label="settings" onClick={() => console.log(cruise)}>
                                <DeleteForeverTwoToneIcon style={{fill: 'orangered'}}/>
                            </IconButton>
                        }
                        title={cruise.country + ", " + cruise.sailingArea}
                        subheader={new Date(cruise.startDate).toLocaleDateString()}
                    />

                    <CardMedia
                        className={classes.media}
                        image="https://user-images.githubusercontent.com/24270855/43633272-6633cc20-9711-11e8-94a4-f1e1c55886d5.JPG"
                        title="cruise map"
                    />

                    <CardContent>
                            {cruise.isDone === false && <p style={{ textAlign: 'right', color: 'green', fontStyle: 'italic', fontWeight: 'bold' }}>Still ACTIVE </p>}
                        <Typography variant="body2" color="textSecondary" component="p" style={{fontSize: '16px'}}>
                            Cruise started in <span style={{color: 'black', fontStyle: 'italic'}}>{cruise.harbour}</span>.
                            Sailed <span style={{ color: 'black', fontStyle: 'italic' }}>{cruise.nauticalMiles}</span> nautical miles on boat
                             <span style={{ color: 'black', fontStyle: 'italic' }}>{" "+cruise.boatID[0].name}</span>.
                        </Typography>
                    </CardContent>

                    <CardActions disableSpacing>
                        <IconButton aria-label="add to favorites" onClick={()=>console.log('downloand', cruise._id)}>
                            <GetAppTwoToneIcon  style={{fill: 'green'}}/>
                        </IconButton>
                        <Typography variant="body2" style={{ fontSize: '14px', color: 'green' }}>
                            download cruise logook
                        </Typography>
                        <IconButton
                            className={clsx(classes.expand, {
                                [classes.expandOpen]: expanded
                            })}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                    </CardActions>

                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <CardContent style={{paddingBottom: '16px'}}>
                            <Grid className={classes.GridContainer}
                                container
                                spacing={5}
                                justify="center"
                                alignItems="center"
                            >
                                <Grid item xs={12} sm={6}>
                                    <Typography paragraph color="secondary">Stats:</Typography>
                                    <p><span style={{ color: 'rgb(35,123,232)' }}>Nautical miles sailed:</span><span style={{ float: 'right' }}>{cruise.nauticalMiles}</span> </p>
                                    <p><span style={{ color: 'rgb(35,123,232)'}}>Hours at sea:</span><span style={{float: 'right'}}>{floatToHoursPlusMinutes(cruise.travelHours)}</span> </p>
                                    <p><span style={{ color: 'rgb(35,123,232)' }}>Sailed on sails:</span> <span style={{ float: 'right' }}>{floatToHoursPlusMinutes(cruise.hoursSailedOnSails)}</span> </p>
                                    <p><span style={{ color: 'rgb(35,123,232)' }}>Sailed on engine:</span> <span style={{ float: 'right' }}>{floatToHoursPlusMinutes(cruise.hoursSailedOnEngine)}</span> </p>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography paragraph color="secondary">Boat:</Typography>
                                        <p><span style={{ color: 'rgb(35,123,232)' }}>Name:</span> <span style={{ float: 'right' }}>{cruise.boatID[0].name}</span> </p>
                                        <p><span style={{ color: 'rgb(35,123,232)' }}>Type:</span> <span style={{ float: 'right' }}>{cruise.boatID[0].type}</span> </p>
                                        <p><span style={{ color: 'rgb(35,123,232)' }}>Draft:</span><span style={{ float: 'right' }}> {cruise.boatID[0].draft}</span> </p>
                                        <p><span style={{ color: 'rgb(35,123,232)' }}>MMSI:</span> <span style={{ float: 'right' }}>{cruise.boatID[0].MMSI}</span> </p>
                                </Grid>
                            </Grid>


                        </CardContent>
                    </Collapse>
                </Card>
            </Grid>
        </>
     );
}

export default OneCruise