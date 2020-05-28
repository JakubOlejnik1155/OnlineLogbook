import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ReactMapGl, { Marker } from "react-map-gl";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useState, useEffect } from 'react';
import { Grid, Paper, CircularProgress, withStyles, Typography, Hidden } from '@material-ui/core';


import BoatGpsIcon from '../../../images/gps/sailboat-boat.svg';
import { convertDMS, GetRequestFunction, unauthorizedLogOut, floatToHoursPlusMinutes } from './constants/functions';
import AuthApi from '../../../authAPI';


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
        background: "rgba(255, 255, 255, 0.64)",
        marginTop: "2vh",
        marginBottom: "2vh"
    },
}))

const DashboardCharts = () => {
    const classes = useStyles();
    const Auth = React.useContext(AuthApi);
    const [positionPermision, setPositionPermision] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [yachtPosition, setYachtPosition] = useState(null);
    const [goalocationObject, setGeolocationObject] = useState();
    const [viewport, setViewport] = useState({
        width: '100%',
        height: '395px',
        borderRadius: '5px',
        latitude: 50.268561,
        longitude: -4.170343,
        zoom: 9,
    });
    const [userInfo, setUserInfo] = useState();
    const [allert, setAllert] = React.useState({
        open: false,
        variant: 'filled',
        duration: 4000,
        type: 'success',
        title: 'success',
        msg: 'success msg',
    });
    //user Info useEffect
    useEffect(()=> {
        try {
                GetRequestFunction('/api/user')
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
                            if(response.success){
                                setUserInfo(response.data)
                            }else{
                                setIsLoading(false);
                                setAllert({ ...allert, open: true, type: 'info', title: 'error: 500', msg: 'it looks that something went wrong maybe try again?' });
                            }
                        }
                    })
        } catch (error) { console.log(error) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    //location useEffect
    useEffect(()=>{
        navigator.geolocation.getCurrentPosition((position) => {
            setGeolocationObject(position)
            setYachtPosition([position.coords.latitude, position.coords.longitude]);
            // setYachtPosition([51.84, -27.95]);
            setViewport({ ...viewport, latitude: position.coords.latitude, longitude: position.coords.longitude })
            setIsLoading(false);
            setPositionPermision(true);
        }, () => {
            setViewport(viewport);
            setIsLoading(false);
            setPositionPermision(false);
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])


    return (
        <>
            <Grid className={classes.GridContainer} container spacing={2}
                justify="flex-start"
                alignItems="flex-start">
                <Grid item xs={12} md={3}>
                    <Paper className={classes.paper} style={{ lineHeight: 1.5, whiteSpace: 'inherit', marginTop: '0', marginBottom: '0' }}>
                        <Typography variant="overline" style={{fontSize: '16px'}}>current GPS data:</Typography>
                        <p style={{fontSize: '16px'}}>
                            <span role='img' aria-label="compasIcon" style={{color: '#f50057', letterSpacing: '2px'}}>🧭Position:</span> {yachtPosition ? convertDMS(yachtPosition[0], yachtPosition[1]) : " - "}
                        </p>
                        <p style={{fontSize: '16px'}}>
                            <span role='img' aria-label="accuracyIcon" style={{ color: '#f50057', letterSpacing: '2px' }}>🌊Altitude:</span> {yachtPosition ? Math.round(goalocationObject.coords.altitude) + "m a.s.l" : "- m a.s.l"}
                        </p>
                        <p style={{fontSize: '16px'}}>
                            <span role='img' aria-label="headingIcon" style={{ color: '#f50057', letterSpacing: '2px' }}>⛵️Heading: </span>{yachtPosition && goalocationObject.coords.heading ? goalocationObject.coords.heading + "°" : " -° "}
                        </p>
                        <p style={{fontSize: '16px'}}>
                            <span role='img' aria-label="accuracyIcon" style={{ color: '#f50057', letterSpacing: '2px' }}>🌏Accuracy:</span> {yachtPosition ? Math.round(goalocationObject.coords.accuracy) + "m" : " - "}
                        </p>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Paper className={classes.paper} style={{ whiteSpace: 'inherit', lineHeight: 1.5, marginTop: '0', marginBottom: '0' }}>
                        <Typography variant="overline" style={{ fontSize: '16px' }}>Account stats:</Typography>
                        <p style={{ fontSize: '16px' }}>
                            <span role='img' aria-label="accuracyIcon" style={{ color: '#f50057', letterSpacing: '2px' }}> ⚓️ Miles:</span> {userInfo ? (Math.round(userInfo.milesSailed * 100) / 100).toFixed(2) + "nm" : " - nm"}
                        </p>
                        <p style={{ fontSize: '16px' }}>
                            <span role='img' aria-label="compasIcon" style={{ color: '#f50057', letterSpacing: '2px' }}>  ⏳ Hours as sea:</span> {userInfo ? floatToHoursPlusMinutes(userInfo.hours) : " - "}
                        </p>
                        <p style={{ fontSize: '16px' }}>
                            <span role='img' aria-label="headingIcon" style={{ color: '#f50057', letterSpacing: '2px' }}> ⛵️ on sails: </span>{userInfo ? floatToHoursPlusMinutes(userInfo.onSails): " -° "}
                        </p>
                        <p style={{ fontSize: '16px' }}>
                            <span role='img' aria-label="accuracyIcon" style={{ color: '#f50057', letterSpacing: '2px' }}> 🚤 on Engine:</span> {userInfo ? floatToHoursPlusMinutes(userInfo.onEngine) : " - "}
                        </p>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper className={classes.paper} style={{ paddingBottom: '.5vw', marginTop: '0', marginBottom: '0' }}>
                        <Typography variant="overline" style={{ fontSize: '16px' }}> <span role="img" aria-label="liveIcon">🟢</span>Live weather:</Typography>
                        {yachtPosition && <LiveWeather yachtPosition={yachtPosition} />}
                        {isLoading && (
                            <div style={{ height: '115px', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
                                <BlackCircularProgress /><br />
                                <h5>Loading position...</h5>
                            </div>
                        )}
                        {!positionPermision && !isLoading && (
                            <div style={{ height: '115px', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
                                <h5>Ups we can't get your position... <span role='img' aria-label="upsemoji">😱</span></h5>
                                <h6>You need to let us use your location</h6>
                            </div>
                        )}
                    </Paper>
                </Grid>
                <Hidden smDown>
                <Grid item xs={12} md={6}>
                    <Paper className={classes.paper} style={{ marginTop: '0', marginBottom: '0' }}>
                        <StaticMap
                            isLoading={isLoading}
                            viewport={viewport}
                            yachtPosition={yachtPosition}
                            positionPermision={positionPermision}
                        />
                    </Paper>
                </Grid>
                </Hidden>
                <Grid item xs={12} md={6}>
                    <Paper className={classes.paper} style={{marginTop: '0', marginBottom: '0'}}>
                        {yachtPosition && (
                            <iframe
                                style={{ width: '100%', height: '378px', marginTop: '10px' }}
                                title="forecast"
                                    src={`https://embed.windy.com/embed2.html?lat=${yachtPosition[0]}&lon=${yachtPosition[1]}&zoom=5&level=surface&overlay=rain&menu=&message=true&marker=true&calendar=&pressure=&type=map&location=coordinates&detail=&detailLat=${yachtPosition[0]}&detailLon=${yachtPosition[1]}&metricWind=kt&metricTemp=%C2%B0C&radarRange=-1`}
                                frameBorder="0">
                             </iframe>
                        )}
                        {isLoading && (
                            <div style={{ width: '100%', height: '375px', marginTop: '10px', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center'}}>
                                <BlackCircularProgress /><br />
                                <h5>Loading position...</h5>
                            </div>
                        )}
                        {!positionPermision && !isLoading && (
                            <div style={{ width: '100%', height: '375px', marginTop: '10px', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center',}}>
                                <h5>Ups we can't get your position... <span role='img' aria-label="upsemoji">😱</span></h5>
                                <h6>You need to let us use your location</h6>
                            </div>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </>
     );
}

export default DashboardCharts;

const LiveWeather = ({ yachtPosition }) => {

    const biggerThenXS = useMediaQuery('(min-width:445px)');
    const classes = useStyles();
    const [weather, setWeather] = useState();
    useEffect(() => {
        const GetForecast = async () => {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${yachtPosition[0]}&lon=${yachtPosition[1]}&units=metric&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`;
            const response = await fetch(url);
            return response.json();
        }
        GetForecast()
            .then(response => {
                setWeather(response)
            })
            .catch(error => console.log(error))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    return (
        <>
        {weather ? (
            <Grid
                className={classes.GridContainer}
                container
                spacing={2}
                justify="flex-start"
                alignItems="flex-start"
                flex-direction="row"
            >
                <Grid item xs={6} style={{textAlign: 'center'}}>
                        <img style={{verticalAlign: "middle"}} src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="weather icon" />
                        <span style={{ fontSize: '24px'}}>{(Math.round(weather.main.temp * 100) / 100).toFixed(1)} °C </span>
                </Grid>
                <Grid item  xs={6}style={{textAlign: 'center'}}>
                        <p style={{ fontSize: '16px' }}>
                            <span role='img' aria-label="accuracyIcon" style={{ color: 'rgb(1,158,1)', letterSpacing: '2px' }}> ☁️ {biggerThenXS && "cloudiness: "} </span>{weather.clouds.all}%
                        </p>
                        <p style={{ fontSize: '16px' }}>
                            <span role='img' aria-label="compasIcon" style={{ color: 'rgb(1,158,1)', letterSpacing: '2px' }}>  💨 {biggerThenXS && "wind: "}  </span>{weather.wind.speed} m/s, {weather.wind.deg}°
                        </p>
                        <p style={{ fontSize: '16px' }}>
                            <span role='img' aria-label="headingIcon" style={{ color: 'rgb(1,158,1)', letterSpacing: '2px' }}> 🕐 {biggerThenXS && "pressure: "} </span>{weather.main.pressure} hPa
                        </p>
                        <p style={{ fontSize: '16px' }}>
                            <span role='img' aria-label="accuracyIcon" style={{ color: 'rgb(1,158,1)', letterSpacing: '2px' }}> 💧{biggerThenXS && "humidity: "} </span> {weather.main.humidity}%
                        </p>
                </Grid>
            </Grid>
        ):(
            <div style={{ height: '115px', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
                <BlackCircularProgress /><br />
                <h5>Loading weather...</h5>
            </div>
        )}
        </>
    )
};

const StaticMap = ({ isLoading, viewport, yachtPosition, positionPermision}) => {
    const classes = useStyles();
    return(
        <ReactMapGl
            {...viewport}
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            mapStyle="mapbox://styles/jakubolejnik/cka83m23t24ph1iog6zhdz6bd"
        >

            {yachtPosition && (
                <Marker className={classes.marker} latitude={yachtPosition[0]} longitude={yachtPosition[1]}>
                    <img style={{transform: 'translate(-10px, -10px)'}} src={BoatGpsIcon} width="20" height="20" alt="boaticon" />
                </Marker>
            )}

            {isLoading && (
                <div style={{ cursor: 'default', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999, display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,.75)', color: 'snow' }}>
                    <ColorCircularProgress /><br />
                    <h5>Loading position...</h5>
                </div>
            )}
            {!positionPermision && !isLoading && (
                <div style={{ cursor: 'default', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999, display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,.75)', color: 'snow' }}>
                    <h5>Ups we can't get your position... <span role='img' aria-label="upsemoji">😱</span></h5>
                    <h6>You need to let us use your location</h6>
                </div>
            )}
            <div style={{ width: '100%', height: '100%', backgroundColor: 'transparent', cursor: 'default' }}></div>
        </ReactMapGl>
    )
};

const ColorCircularProgress = withStyles({
    root: {
        color: 'snow',
    },
})(CircularProgress);
const BlackCircularProgress = withStyles({
    root: {
        color: 'black',
    },
})(CircularProgress);