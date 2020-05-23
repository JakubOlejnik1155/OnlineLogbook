import React from 'react';
import ReactMapGl, {Marker, Popup} from "react-map-gl";
import { useState } from 'react';
import {Grid, Paper, Button} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';


import { useStyles } from './constants/styleObject';
import { convertDMS } from './constants/functions';
const Map = () => {

    const classes = useStyles();
    const [data, setData] = React.useState([]);
    const [viewport, setViewport] = useState({
        width: '100%',
        height: 'calc(100vh - 150px)',
        borderRadius: '5px',
        latitude: 41.040683,
        longitude: 9.537739,
        zoom: 9,
    })
    const prevData = usePrevious(viewport);
    const [selectedPoint, setSelectedPoint] = React.useState(null);

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
                <Grid item xs={12} md={8} >
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
                            {data && viewport.zoom >= 6 && data.map(point => (
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
                                        {selectedPoint.images.data[0] && <p><img src={selectedPoint.images.data[0].medium_url} width="95" alt="icon" style={{ verticalAlign: 'middle', marginRight: 5 }} /></p> }
                                        <Button target="_blank" href={selectedPoint.web_url}>Find out more</Button>
                                    </div>
                                </Popup>
                            )}
                            {viewport.zoom < 6 && (
                                <Alert
                                severity="info"
                                style={{ position: 'absolute', top: 5, left: 5, marginRight: 5}}
                                >
                                    Zoom in to show mainas and harbors on map!!!
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