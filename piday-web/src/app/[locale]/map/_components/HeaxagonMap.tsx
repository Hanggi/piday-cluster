"use client";

import { H3HexagonLayer } from "@deck.gl/geo-layers/typed";
import DeckGL from "@deck.gl/react/typed";
import "mapbox-gl/dist/mapbox-gl.css";

import { GeolocateControl, Map, NavigationControl } from "react-map-gl";

import { bboxFromViewport, getH3IndicesForBB } from "../_lib/utils";

const TOKEN =
  "pk.eyJ1Ijoic2VhbmJvcmFtbGVlIiwiYSI6ImNrbTJlcnFqejE3NGQydXFtZng1cXR4eGgifQ.oZ0mZBtUX5u72QTPtPITfA";

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
  // const [viewport, setViewPort] = useState(INITIAL_VIEW_PORT);

  console.log("viewport", newPlace);
  const boundingBox = bboxFromViewport(newPlace);
  const h3Indices = getH3IndicesForBB(boundingBox);
  console.log("h3Indices", h3Indices);

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
        onClick={({ object }: any) => setHexId(object.hex)}
        initialViewState={newPlace}
        controller={true}
        layers={layers}
      >
        <Map
          mapboxAccessToken={TOKEN}
          initialViewState={newPlace}
          style={{ width: "100%", height: "545px", borderRadius: "10px" }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          // onDblClick={handleClick}
          doubleClickZoom={false}
        >
          {/* {
                        newPlace &&
                        <>
                            <Marker
                                longitude={`${newPlace?.longitude}`}
                                latitude={`${newPlace?.latitude}`}
                                anchor="bottom"
                                draggable={true}
                                onDragEnd={handleClick}
                            >
                                <MapPinIcon className='w-10 h-10 text-blue-600' />
                            </Marker>
                        </>
                    } */}
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
