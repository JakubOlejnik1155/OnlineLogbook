import React from 'react';
import ReactMapGl, {Marker, Popup} from "react-map-gl";
import { useState } from 'react';
import {Grid, Paper, Button, Typography, CircularProgress, withStyles} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';


import { useStyles } from './constants/styleObject';
import { convertDMS } from './constants/functions';
// import BoatGpsIcon from '../../../images/gps/sailing-boat.svg';
import BoatGpsIcon from '../../../images/gps/sailboat-boat.svg';
import centerIcon from '../../../images/gps/center-gps.svg';


const Map = ({height, width}) => {

    const classes = useStyles();
    const [data, setData] = React.useState([]);
    const [loadingPosition, setLoadingPosition] = React.useState(true);
    const [viewport, setViewport] = useState({
        width: width,
        height: height,
        borderRadius: '5px',
        latitude: 50.268561,
        longitude: -4.170343,
        zoom: 9,
    })
    const prevData = usePrevious(viewport);
    const [selectedPoint, setSelectedPoint] = React.useState(null);
    const [accuracy, setAccuracy] = React.useState(null);
    const [yachtPosition, setYachtPosition] = React.useState(null)

    React.useEffect(()=>{
        navigator.geolocation.getCurrentPosition((position) => {
                setAccuracy(position.coords.accuracy);
                setYachtPosition([position.coords.latitude, position.coords.longitude]);
                setViewport({ ...viewport, latitude: position.coords.latitude, longitude: position.coords.longitude })
                setLoadingPosition(false);
            }, ()=> {
            setViewport(viewport);
            setLoadingPosition(false);
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    React.useEffect(()=> {
        const listener = e => {
            if(e.key === 'Escape') setSelectedPoint(null)
        }
        window.addEventListener('keydown', listener)

        const options = {
            method: 'GET',
        };
        //delete if not required
        if(prevData){}
        GetFromMatinasAPI(`https://api.marinas.com/v1/points/search?access_token=${process.env.REACT_APP_MARINAS_TOKEN}&location[lat]=${viewport.latitude}&location[lon]=${viewport.longitude}`, options)
        .then(response => {
            setData(response.data);
        })
        return ()=>{
            window.removeEventListener('keydown', listener);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getNewPoints = () => {
        const options = {
            method: 'GET',
        };
        GetFromMatinasAPI(`https://api.marinas.com/v1/points/search?access_token=${process.env.REACT_APP_MARINAS_TOKEN}&location[lat]=${viewport.latitude}&location[lon]=${viewport.longitude}`, options)
            .then(response => {
                setData(response.data);
            })
    }

    return (
        <>
            <Grid className={classes.GridContainer}
                container
                spacing={2}
                justify="center"
                alignItems="center"
            >
                <Grid item xs={12} lg={8}>
                    <Paper className={classes.paper} style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)'}}>

                        <ReactMapGl
                            {...viewport}
                            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                            onViewportChange={viewport => { setViewport(viewport); setSelectedPoint(null)}}
                            maxZoom={14}
                            minZoom={4}
                            mapStyle="mapbox://styles/jakubolejnik/cka83m23t24ph1iog6zhdz6bd"
                            onTouchEnd={()=>{getNewPoints();}}
                            onMouseUp={() => { getNewPoints();}}
                            >

                                {yachtPosition && (
                                    <>
                                    <div style={{
                                        width: '35px',
                                        height: '35px',
                                        position: 'absolute',
                                        top: 5,
                                        right: 5,
                                        borderRadius: 5,
                                        border: '.5px solid black',
                                        backgroundColor: 'rgba(46,128,233, .8)',
                                        cursor: 'pointer',
                                    }} onClick={() => { setViewport({ ...viewport, zoom: 9,latitude: yachtPosition[0], longitude: yachtPosition[1] }) }}>
                                        <img style={{
                                            position: 'absolute',
                                            margin: 'auto',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0
                                        }}
                                            src={centerIcon} alt="centerIcon" width="25" height="25" />
                                    </div>
                                    <span style={{padding: 5, backgroundColor: 'rgba(0, 0, 0, .75)', borderRadius: '6px', color: 'snow'}}>
                                        <Typography style={{margin: 0, padding: 0}} variant="overline">accuracy: {Math.round(accuracy)}m</Typography>
                                    </span>
                                    </>
                                )}

                                {data && viewport.zoom >= 9 && data.map(point => (
                                   <Marker
                                        key={point.id}
                                        latitude={point.location.lat}
                                        longitude={point.location.lon}
                                        className={classes.marker}
                                    >
                                        <img
                                            src={point.icon_urls.light}
                                            alt="marina-icon"
                                            width="24"
                                            height="24"
                                            onClick={()=>{setSelectedPoint(point)}}
                                            style={{cursor: 'pointer'}}
                                        />
                                    </Marker>
                                ))}

                                {yachtPosition && (
                                    <Marker className={classes.marker} latitude={yachtPosition[0]} longitude={yachtPosition[1]}>
                                            <img src={BoatGpsIcon} width="20" height="20" alt="boaticon"/>
                                    </Marker>
                                )}

                                {selectedPoint && (
                                    <Popup
                                        className={classes.popup}
                                        latitude={selectedPoint.location.lat}
                                        longitude={selectedPoint.location.lon}
                                        onClose={()=> setSelectedPoint(null)}
                                        closeOnClick={false}
                                    >
                                        <div>
                                            <p>
                                                <img src={selectedPoint.icon_urls.light} alt="icon" width="30" height="30" style={{verticalAlign: 'middle', marginRight: 5}}/>
                                                <span>{selectedPoint.name}</span>
                                            </p>
                                            <p style={{color: 'gray', fontStyle: 'italic'}}>
                                                {convertDMS(selectedPoint.location.lat, selectedPoint.location.lon)}
                                            </p>
                                            {selectedPoint.images.data[0] && <p style={{marginBottom: '10px'}}><img src={selectedPoint.images.data[0].medium_url} width="130" alt="icon" style={{ verticalAlign: 'middle', marginRight: 5 }} /></p> }
                                            <Button className={classes.buttonBgc} target="_blank" href={selectedPoint.web_url}>Find out more</Button>
                                        </div>
                                    </Popup>
                                )}

                                {loadingPosition && (
                                    <div style={{cursor: 'default',position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,zIndex:999, display:'flex', alignItems: 'center',flexDirection:'column', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,.75)', color: 'snow'}}>
                                        <ColorCircularProgress /><br/>
                                        <h5>Loading position...</h5>
                                    </div>
                                )}

                                {viewport.zoom < 9 && (
                                    <Alert
                                    severity="info"
                                    style={{ position: 'absolute', bottom: 5, left: 5, marginRight: 5, zIndex: 999}}
                                    >
                                    Zoom in to show mainas and harbors on map!!! <span role="img" aria-label="anchor">⚓️</span>
                                    </Alert>
                                )}
                        </ReactMapGl>
                    </Paper>
                </Grid>
            </Grid>

        </>
     );
}

export default Map;


function usePrevious(value) {
    const ref = React.useRef();
    React.useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}
const GetFromMatinasAPI = async (url, options) => {
    const response = await fetch(url, options);
    return response.json()
}
const ColorCircularProgress = withStyles({
    root: {
        color: 'snow',
    },
})(CircularProgress);