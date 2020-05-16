import React from 'react';
import ReactMapGl from "react-map-gl";
import { useState } from 'react';

const Map = () => {

    const [viewport, setViewport] = useState({
        width: '100%',
        height: 'calc(100vh - 60px)',
        latitude: 52.484228,
        longitude: 16.784784,
        zoom: 14,
    })



    return (
        <>
            <ReactMapGl
                {...viewport}
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                onViewportChange={viewport => setViewport(viewport)}
                mapStyle="mapbox://styles/jakubolejnik/cka83m23t24ph1iog6zhdz6bd"
            >
                markers here
            </ReactMapGl>
        </>
     );
}

export default Map;