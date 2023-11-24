"use client"
import React, { createContext, useState } from 'react';

type mapState = {
    [key: string]: any
}

export const MapContext = createContext<mapState>({});

const MapProvider = ({ children }:{children:React.ReactNode}) => {
    const [viewPort, setViewPort] = useState({
        longitude: -122.41669,
        latitude: 37.7853,
        width: 800,
        height: 800,
        zoom: 13,
        pitch: 0,
        bearing: 0
    });
    const [newPlace, setNewPlace] = useState({
        longitude: -122.41669,
        latitude: 37.7853,
        width: 800,
        height: 800,
        zoom: 13,
        pitch: 0,
        bearing: 0
    });
    const [country, setCountry] = useState<object | null>({});

    const mapInfo = {
        viewPort,
        setViewPort,
        newPlace,
        setNewPlace,
        country,
        setCountry
    }
    return (
        <MapContext.Provider value={mapInfo}>
            {children}
        </MapContext.Provider>
    );
};

export default MapProvider;