"use client";

import type { ViewStateChangeParameters } from "@deck.gl/core/typed/controllers/controller";
import { PickingInfo } from "@deck.gl/core/typed/lib/picking/pick-info";
import { H3HexagonLayer } from "@deck.gl/geo-layers/typed";
import DeckGL from "@deck.gl/react/typed";
import { geoToH3, kRing } from "h3-js";
import { debounce } from "lodash";

import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";

import { useCallback, useEffect, useState } from "react";
import Map, { GeolocateControl, NavigationControl } from "react-map-gl";

const INITIAL_VIEW_STATE = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
  pitch: 0,
  bearing: 0,
};

interface VirtualEstate {
  hexID: string;
}

interface Props {
  token: string;
}

export default function VirtualEstateMap({ token }: Props) {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [hexagons, setHexagons] = useState<VirtualEstate[]>([]);
  const [centerHex, setCenterHex] = useState<string>("");

  const [selectedHexId, setSelectedHexId] = useState<string>("");

  useEffect(() => {
    const ch = centerHex; // 示例中心六边形
    const hexagons = kRing(ch, 60).map((hex) => {
      return {
        hexID: hex,
        // boundary: h3ToGeoBoundary(hex),
      };
    });

    if (viewState.zoom >= 15) {
      setHexagons(hexagons as any);
    } else {
      setHexagons([]);
    }
  }, [centerHex, viewState.zoom]);

  const layers = [
    new H3HexagonLayer({
      id: "h3-hexagon-layer",
      data: hexagons,
      pickable: true,
      wireframe: true,
      extruded: false, // 确保六边形不是挤出的
      filled: true, // 使六边形为空心
      elevationScale: 0,
      getLineColor: (d) => [112, 48, 160], // 设置六边形的边线颜色
      getHexagon: (d) => d.hexID, // 从数据对象中获取H3索引
      getFillColor: (d) => {
        return selectedHexId == d.hexID
          ? [112, 48, 160, 200]
          : [255, 255, 255, 0];
      },
      // getElevation: (d) => 10, // 设置六边形的高度，仅当extruded为true时有效
    }),
  ];

  // Debounce to set center hexagon
  const debounceToSetCenterHex = debounce((viewState) => {
    setViewState(viewState);
    const hexID = geoToH3(viewState.latitude, viewState.longitude, 12);

    setCenterHex(hexID);
  }, 500);

  const onMapViewChange = useCallback(
    (params: ViewStateChangeParameters) => {
      debounceToSetCenterHex(params.viewState);
    },
    [debounceToSetCenterHex],
  );

  const handleClickHexagon = useCallback(
    (e: PickingInfo) => {
      if (e.coordinate) {
        const hexID = geoToH3(e.coordinate[1], e.coordinate[0], 12);
        setSelectedHexId(hexID);
        setViewState({
          ...viewState,
          zoom: viewState.zoom + 0.001,
        });
      }
    },
    [viewState],
  );

  return (
    <div className="relative pb-[-20px] w-full h-full">
      <DeckGL
        controller={true}
        initialViewState={INITIAL_VIEW_STATE}
        layers={layers}
        onClick={handleClickHexagon}
        onViewStateChange={onMapViewChange}
      >
        <Map
          initialViewState={INITIAL_VIEW_STATE}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken={token}
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "-50px",
          }}
        >
          <NavigationControl position="bottom-right" />
          <GeolocateControl
            position="bottom-left"
            style={{ zIndex: 110, position: "relative" }}
            trackUserLocation
          />
        </Map>
      </DeckGL>
      <Card className="absolute top-4 m-4 w-max z-[1000]" size="sm">
        <div className="flex gap-2">
          <Typography level="body-sm">
            Latitude: {viewState.latitude.toFixed(4)}
          </Typography>
          <Typography level="body-sm">
            Longitude: {viewState.longitude.toFixed(4)}
          </Typography>
          <Typography level="body-sm">
            Zoom: {viewState.zoom.toFixed(2)}
          </Typography>
        </div>
      </Card>
    </div>
  );
}
