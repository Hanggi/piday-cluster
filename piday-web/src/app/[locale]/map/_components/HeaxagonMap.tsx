"use client";

import { H3HexagonLayer } from "@deck.gl/geo-layers/typed";
import DeckGL from "@deck.gl/react/typed";

import { ElementRef, useRef } from "react";
import { GeolocateControl, Map, NavigationControl } from "react-map-gl";

import { bboxFromViewport, getH3IndicesForBB } from "../_lib/utils";

const TOKEN = process.env.mapboxToken;

// Viewport settings
const INITIAL_VIEW_PORT = {
  viewState: {
    longitude: -122.41669,
    latitude: 37.7853,
    width: 400,
    height: 400,
    zoom: 13,
    pitch: 0,
    bearing: 0,
  },
};

// Data to be used by the LineLayer
const data = [
  {
    hex: "88283082b9fffff",
    count: 1,
  },
];

const HexagonMap = ({
  viewPort,
  setViewPort,
  newPlace,
  setNewPlace,
  setAddress,
  setHexId,
}: any) => {
  const boundingBox = bboxFromViewport(newPlace);
  const h3Indices = getH3IndicesForBB(boundingBox);

  const mapRef = useRef<ElementRef<typeof Map>>(null);

  const data = h3Indices.map((h3): any => ({
    hex: h3,
  }));

  const layers = [
    new H3HexagonLayer({
      id: "h3-hexagon-layer",
      data,
      pickable: true,
      wireframe: true,
      filled: true,
      extruded: false,
      elevationScale: 0,
      getHexagon: (d) => d.hex,
      getElevation: (d) => d.count,
      getFillColor: (d) => [255, 255, 255, 1],
    }),
  ];

  return (
    <div className="App">
      <DeckGL
        onClick={({ object }) => setHexId(object.hex)}
        initialViewState={newPlace}
        controller={true}
        style={{
          width: "100%",
          aspectRatio: "1/1",
          borderRadius: "10px",
          overflow: "hidden",
        }}
        layers={layers}
      >
        <Map
          ref={mapRef}
          mapboxAccessToken={TOKEN}
          initialViewState={newPlace}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          doubleClickZoom={false}
        >
          <NavigationControl position="bottom-right" />
          <GeolocateControl
            trackUserLocation
            position="bottom-right"
            style={{ zIndex: 10, position: "relative" }}
          />
        </Map>
      </DeckGL>
    </div>
  );
};

export default HexagonMap;
