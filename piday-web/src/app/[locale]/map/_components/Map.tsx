"use client";

import { MapContext } from "@/src/contexts/MapProvider";

import { useRouter } from "next/navigation";

import { useContext, useEffect } from "react";
import {
  GeolocateControl,
  Marker,
  NavigationControl,
  Map as ReactMap,
} from "react-map-gl";

const Map = () => {
  const router = useRouter();
  const { viewPort, setViewPort, newPlace, setNewPlace, setCountry, country } =
    useContext(MapContext);
  const Token = process.env.mapboxToken;

  useEffect(() => {
    fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${newPlace?.latitude}&lon=${newPlace?.longitude}&apiKey=aedfc55bf9914481a366f3567ec7b5eb`,
    )
      .then((res) => res.json())
      .then((data) => setCountry(data.features[0].properties));
  }, [viewPort, newPlace]);

  const handleClick = (e: any) => {
    const longitude = e.lngLat.lng;
    const latitude = e.lngLat.lat;
    setNewPlace({
      latitude: latitude,
      longitude: longitude,
      width: 800,
      height: 800,
      zoom: 13,
      pitch: 0,
      bearing: 0,
    });
    if (country) {
      router.push("/map/details");
    }
  };
  return (
    <div className="relative">
      <ReactMap
        mapboxAccessToken={Token}
        initialViewState={viewPort}
        style={{ width: "100%", height: "80vh", borderRadius: "10px" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onDblClick={handleClick}
        doubleClickZoom={false}
      >
        {newPlace ? (
          <>
            <Marker
              longitude={newPlace?.longitude}
              latitude={newPlace?.latitude}
              anchor="bottom"
              draggable={true}
              onDragEnd={handleClick}
            >
              <i className="ri-map-pin-fill text-4xl text-blue-600"></i>
            </Marker>
          </>
        ) : (
          <>
            <Marker
              longitude={viewPort?.longitude}
              latitude={viewPort.latitude}
              anchor="bottom"
            >
              <i className="ri-map-pin-fill text-4xl text-blue-600"></i>
            </Marker>
          </>
        )}
        <NavigationControl position="bottom-right" />
        <GeolocateControl trackUserLocation position="bottom-right" />
      </ReactMap>
    </div>
  );
};

export default Map;
