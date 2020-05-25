import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ReactMapGl, { Marker } from "react-map-gl";
import { useState, useEffect } from 'react';
import { Grid, Paper, CircularProgress, withStyles } from '@material-ui/core';
import BoatGpsIcon from '../../../images/gps/sailboat-boat.svg';
import { convertDMS } from './constants/functions';


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
    const [positionPermision, setPositionPermision] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [yachtPosition, setYachtPosition] = useState(null);
    const [goalocationObject, setGeolocationObject] = useState();
    const [viewport, setViewport] = useState({
        width: '100%',
        height: '300px',
        borderRadius: '5px',
        latitude: 50.268561,
        longitude: -4.170343,
        zoom: 9,
    });

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
        <Grid className={classes.GridContainer} container spacing={2}
            justify="flex-start"
            alignItems="flex-start">
            <Grid item xs={12} md={4}>
                <Paper className={classes.paper}>
                    <p style={{fontSize: '18px'}}>
                        <span role='img' aria-label="compasIcon">🧭</span>Position: {yachtPosition ? convertDMS(yachtPosition[0], yachtPosition[1]) : " - "}
                    </p>
                    <p style={{fontSize: '18px'}}>
                        <span role='img' aria-label="accuracyIcon">🌊</span>Altitude: {yachtPosition ? Math.round(goalocationObject.coords.altitude) + "m a.s.l" : "- m a.s.l"}
                    </p>
                    <p style={{fontSize: '18px'}}>
                        <span role='img' aria-label="headingIcon">⛵️</span>Headind: {yachtPosition && goalocationObject.coords.heading ? goalocationObject.coords.heading + "°" : " -° "}
                    </p>
                    <p style={{fontSize: '18px'}}>
                        <span role='img' aria-label="accuracyIcon">🌏</span>Accuracy: {yachtPosition ? goalocationObject.coords.accuracy + "m" : " - "}
                    </p>
                </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
                <Paper className={classes.paper}> current cruise </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
                <Paper className={classes.paper}>map
                </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper className={classes.paper} style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                    <StaticMap
                        isLoading={isLoading}
                        viewport={viewport}
                        yachtPosition={yachtPosition}
                        positionPermision={positionPermision}
                    />
                </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper className={classes.paper} style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)'}}>
                    {yachtPosition && (
                        <iframe
                            style={{ width: '100%', height: '187px', marginTop: '10px' }}
                            title="forecast"
                            src={`https://embed.windy.com/embed2.html?lat=${yachtPosition[0]}&lon=${yachtPosition[1]}&zoom=3&level=surface&overlay=wind&menu=&message=&marker=&calendar=&pressure=&type=forecast&location=coordinates&detail=true&detailLat=${yachtPosition[0]}&detailLon=${yachtPosition[1]}&metricWind=kt&metricTemp=%C2%B0C&radarRange=-1`}
                            frameBorder="0">
                        </iframe>
                    )}
                    {isLoading && (
                        <div style={{ width: '100%', height: '187px', marginTop: '10px', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,.75)', color: 'snow' }}>
                            <ColorCircularProgress /><br />
                            <h5>Loading position...</h5>
                        </div>
                    )}
                    {!positionPermision && !isLoading && (
                        <div style={{ width: '100%', height: '187px', marginTop: '10px', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,.75)', color: 'snow' }}>
                            <h5>Ups we can't get your position... <span role='img' aria-label="upsemoji">😱</span></h5>
                            <h6>You need to let us use your location</h6>
                        </div>
                    )}
                </Paper>
            </Grid>
        </Grid>
     );
}

export default DashboardCharts;


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