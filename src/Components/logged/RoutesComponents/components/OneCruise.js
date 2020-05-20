import React from 'react';
import clsx from "clsx";
import { Grid, Card, CardHeader, CardContent, Typography, CardActions, Collapse, IconButton, CircularProgress, Divider, withStyles} from '@material-ui/core';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ReactCountryFlag from "react-country-flag"
import DeleteForeverTwoToneIcon from '@material-ui/icons/DeleteForeverTwoTone';
import GetAppTwoToneIcon from '@material-ui/icons/GetAppTwoTone';
import ReactMapGl from "react-map-gl";
import { saveAs } from 'file-saver';
import axios from 'axios';
import Cookies from 'js-cookie';


import AuthApi from '../../../../authAPI';
import connections from '../../../connections';
import Allert from './Allert';
import { useStyles } from '../constants/styleObject';
import {countryList} from '../constants/countres';
import { unauthorizedLogOut, GetRequestFunction, PostRequestFunction } from '../constants/functions';


const OneCruise = ({cruise}) => {

    const classes = useStyles();
    const Auth = React.useContext(AuthApi);
    const [expanded, setExpanded] = React.useState(false);
    const [ISO, setISO] = React.useState("US");
    const [data, setData] = React.useState();
    const [isLoading, setIsLoading] = React.useState(true);
    const [isPdfLoading, setIsPdfLoading] = React.useState(false);
    const [isCruiseLogbookLoading, setIsCruiseLogbookLoading] = React.useState(false)
    const [viewport, setViewport] = React.useState({
        width: '100%',
        cursor: 'pointer',
        height: '300px',
        latitude: 32.890983,
        longitude: - 16.734528,
        zoom: 7,
    })
    const [allert, setAllert] = React.useState({
        open: false,
        variant: 'filled',
        duration: 4000,
        type: 'success',
        title: 'success',
        msg: 'success msg',
    });

    //get days
    React.useEffect(()=>{
        try{
            setTimeout(() => {
                GetRequestFunction(`/api/days/cruise/${cruise._id}`)
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
                             if (response.error) {
                                setAllert({ ...allert, duration: 99999, open: true, type: 'error', title: response.error.code, msg: response.error.msg + "Try to reload the page!!!" })
                            }
                            else {
                                setData(response);
                                let lat = 0;
                                let lng = 0;
                                let counter = 0;
                                response.data.forEach((day)=>{
                                    day.hourlyArray.forEach((hour)=>{
                                        lat += hour.latitude;
                                        lng += hour.longitude;
                                        counter++;
                                    })
                                });
                                if(lat !== 0 && lng !== 0){
                                 setViewport({
                                     ...viewport,
                                     latitude: lat/counter,
                                     longitude: lng/counter,
                                    })
                                }
                                setIsLoading(false)
                            }
                        }
                    })
            }, 1000)
        }catch(error){console.log(error)}
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    //ISO
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

    const DownloandDayLogbook = (id) => {
        setIsPdfLoading(id);
        let day ={};
        data.data.forEach(element => {
            if (element._id === id ){
                day = element;
            }
        })
        const token = Cookies.get('RefreshToken');
        PostRequestFunction("/api/days/pdf", day)
            .then((response) => {
                if (response.error && response.error.code === 401) throw Error(401)
                else return axios.get(connections.server.concat("/api/days/pdf"), {
                    responseType: 'blob',
                    headers: {
                        'authorization': `Bearer ${token}`
                    }
                })
            })
            .then(response => {
                const pdfBlob = new Blob([response.data], {type: 'application/pdf'});
                setIsPdfLoading(false);
                saveAs(pdfBlob, `${new Date(day.date).toLocaleDateString()}.pdf`)
            })
            .catch(error => {
                setIsPdfLoading(false);
                if (error.message === "401") {
                    console.log('unauthorized');
                    setAllert({ ...allert, open: true, type: 'error', title: 'Error 401', msg: 'you are not authorized' })
                    setTimeout(() => {
                        Auth.setAuth(false);
                        unauthorizedLogOut();
                    }, 3000)
                }
            })
    }

    const DownloandCruiseLogbook = days => {
        setIsCruiseLogbookLoading(true)
        const token = Cookies.get('RefreshToken');
        PostRequestFunction("/api/cruises/pdf", days)
            .then((response) =>{
                if (response.error && response.error.code === 401) throw Error(401)
                else return axios.get(connections.server.concat("/api/cruises/pdf"), {
                    responseType: 'blob',
                    headers: {
                        'authorization': `Bearer ${token}`
                    }
                })
            })
            .then(response => {
                    const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
                    setIsCruiseLogbookLoading(false)
                    saveAs(pdfBlob, `${cruise.country}_${cruise.sailingArea}_${new Date(cruise.startDate).getFullYear()}.pdf`)
            })
            .catch(error => {
                setIsCruiseLogbookLoading(false)
                if (error.message === "401") {
                    console.log('unauthorized');
                    setAllert({ ...allert, open: true, type: 'error', title: 'Error 401', msg: 'you are not authorized' })
                    setTimeout(() => {
                        Auth.setAuth(false);
                        unauthorizedLogOut();
                    }, 3000)
                }
            })
    };

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


                        <ReactMapGl
                            {...viewport}
                            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                            // onViewportChange={viewport => setViewport(viewport)}
                            mapStyle="mapbox://styles/jakubolejnik/cka83m23t24ph1iog6zhdz6bd"
                        >
                            {isLoading &&(
                                <div style={{ width: '100%', height: '100%', backgroundColor: 'gray',display: 'flex', justifyContent: 'center', alignItems:'center'}}>
                                    <CircularProgress style={{ color: 'rgb(245,2,87)'}}/>
                                </div>
                            )}
                        <div style={{ width: '100%', height: '100%', backgroundColor: 'transparent', cursor: 'default'}}></div>
                        </ReactMapGl>


                    <CardContent>
                            {/* {cruise.isDone === false && <p style={{ textAlign: 'right', color: 'green', fontStyle: 'italic', fontWeight: 'bold' }}>Still ACTIVE </p>} */}
                        <Typography variant="body2" color="textSecondary" component="p" style={{fontSize: '16px'}}>
                            Cruise started in <span style={{color: 'black', fontStyle: 'italic'}}>{cruise.harbour}</span>.
                            Sailed <span style={{ color: 'black', fontStyle: 'italic' }}>{Math.round(cruise.nauticalMiles*100)/100}</span> nautical miles on boat
                             <span style={{ color: 'black', fontStyle: 'italic' }}>{" "+cruise.boatID[0].name}</span>.
                        </Typography>
                    </CardContent>

                    <CardActions disableSpacing>
                        {cruise.isDone === false ? <p style={{ paddingLeft: '10px', color: 'green', fontStyle: 'italic', fontWeight: 'bold' }}> cruise is still active </p> :(
                        <>
                            <IconButton aria-label="add to favorites" onClick={() => DownloandCruiseLogbook(data)}>
                                    {!isCruiseLogbookLoading && <GetAppTwoToneIcon style={{ fill: 'green' }} />}
                                    {isCruiseLogbookLoading  && <ColorCircularProgress size={24} thickness={4} />} 
                            </IconButton>
                            <Typography variant="body2" style={{ fontSize: '14px', color: 'green' }}>
                                download cruise logook
                            </Typography>
                        </>
                        )}
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
                                    <p><span style={{ color: 'rgb(35,123,232)' }}>Nautical miles sailed:</span><span style={{ float: 'right' }}>{Math.round(cruise.nauticalMiles*100)/100} nm</span> </p>
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


                                <Grid item xs={12}>
                                    <Typography paragraph color="secondary">Days: <span style={{ color: 'rgb(35,123,232)' }}>{data ? data.data.length : "loading"}</span></Typography>
                                        {data && data.data.map(day=>(

                                            <div key={day._id}>
                                                <p style={{ color: 'gray', fontStyle: 'italic' }}>{new Date(day.date).toLocaleDateString()}<span style={{ float: 'right' }}> <DeleteForeverTwoToneIcon style={{ fill: 'orangered', cursor: 'pointer' }} /> </span></p>
                                                <p style={{paddingLeft: '10px'}}> <span style={{ fontSize: '12px',color: 'gray', fontStyle: 'italic' }}>from</span> {day.startHarbor} <span style={{ fontSize: '12px',color: 'gray', fontStyle: 'italic' }}>  to</span> {day.endHarbor}</p>


                                                <p style={{paddingLeft: '10px'}}><span style={{ color: 'rgb(35,123,232)' }}>Hours at sea:</span><span style={{ float: 'right' }}> {floatToHoursPlusMinutes(day.travelHours)}</span> </p>
                                                <p style={{ paddingLeft: '10px' }}><span style={{ color: 'rgb(35,123,232)' }}>Nautical miles:</span> <span style={{ float: 'right' }}>{Math.round(day.nauticalMiles *100)/100} nm</span> </p>
                                                <p style={{paddingLeft: '10px'}}><span style={{ color: 'rgb(35,123,232)' }}>On sails:</span> <span style={{ float: 'right' }}>{floatToHoursPlusMinutes(day.hoursSailedOnSails)}</span> </p>
                                                <p style={{paddingLeft: '10px'}}><span style={{ color: 'rgb(35,123,232)' }}>On engine:</span> <span style={{ float: 'right' }}>{floatToHoursPlusMinutes(day.hoursSailedOnEngine)}</span> </p>

                                                {day.isDone ? (
                                                    <>
                                                        <Typography variant="body2" style={{ fontSize: '14px', color: 'green', paddingLeft: '10px', textAlign: 'right' }}>
                                                            download day logook
                                                        <IconButton aria-label="downloand logbook" disabled={isPdfLoading === day._id ? true : false} onClick={() => DownloandDayLogbook(day._id)}>
                                                                {isPdfLoading !== day._id && <GetAppTwoToneIcon style={{ fill: 'green' }} /> }
                                                                {isPdfLoading === day._id && <ColorCircularProgress size={24} thickness={4} />}
                                                            </IconButton>
                                                        </Typography>
                                                    </>
                                                ): (
                                                    <Typography variant="body2" style={{ fontSize: '14px', color: 'green', padding: '12px 0 12px 10px', textAlign: 'right' }}>
                                                        Day is still ACTIVE.
                                                    </Typography>
                                                )}
                                                <Divider style={{ margin: '0px 0 10px 0' }} />
                                            </div>


                                        ))}
                                </Grid>

                            </Grid>
                        </CardContent>
                    </Collapse>
                </Card>
            </Grid>
            <Allert
                allert={allert}
                setAllert={setAllert} />
        </>
     );
}

export default OneCruise

const ColorCircularProgress = withStyles({
    root: {
        color: 'rgb(68,183,0)',
        width: '24px',
        height: '24px',
    },
})(CircularProgress);