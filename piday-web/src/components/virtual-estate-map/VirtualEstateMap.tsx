"use client";

import { FlyToInterpolator, MapViewState } from "@deck.gl/core/typed";
import type { ViewStateChangeParameters } from "@deck.gl/core/typed/controllers/controller";
import { PickingInfo } from "@deck.gl/core/typed/lib/picking/pick-info";
import { H3HexagonLayer } from "@deck.gl/geo-layers/typed";
import DeckGL from "@deck.gl/react/typed";
import { geoToH3, h3ToGeo, kRing } from "h3-js";
import { debounce } from "lodash";

import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";

import { useCallback, useEffect, useState } from "react";
import Map, { GeolocateControl, NavigationControl } from "react-map-gl";

const SHOW_HEXAGON_LAYER_FROM_ZOOM = 15;

const INITIAL_VIEW_STATE: MapViewState = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 3,
  pitch: 0,
  bearing: 0,
};

interface VirtualEstate {
  hexID: string;
}

interface Props {
  token: string;
  defaultHexID?: string;
  withoutAnimation?: boolean;
  onVirtualEstateClick?: (hexID: string) => void;
}

export default function VirtualEstateMap({
  token,
  defaultHexID,
  withoutAnimation,
  onVirtualEstateClick,
}: Props) {
  const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE);
  const [hexagons, setHexagons] = useState<VirtualEstate[]>([]);
  const [centerHex, setCenterHex] = useState<string>("");
  const [mounted, setMounted] = useState<boolean>(false);

  const [selectedHexID, setSelectedHexID] = useState<string>("");

  useEffect(() => {
    const ch = centerHex; // 示例中心六边形
    const hexagons = kRing(ch, 60).map((hex) => {
      return {
        hexID: hex,
        // boundary: h3ToGeoBoundary(hex),
      };
    });

    if (viewState.zoom >= SHOW_HEXAGON_LAYER_FROM_ZOOM) {
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
        return selectedHexID == d.hexID
          ? [112, 48, 160, 200]
          : [255, 255, 255, 0];
      },
      // getElevation: (d) => 10, // 设置六边形的高度，仅当extruded为true时有效
    }),
  ];

  // When the default hex id is non-empty, initialize coordinate animation
  useEffect(() => {
    if (defaultHexID) {
      const target = h3ToGeo(defaultHexID);

      setSelectedHexID(defaultHexID);
      setCenterHex(defaultHexID);
      setTimeout(() => {
        setViewState((vs) => ({
          ...vs,
          longitude: target[1],
          latitude: target[0],
          zoom: 17,

          transitionDuration: withoutAnimation ? 0 : 3000, // 设置较长的过渡时间，例如 3 秒
          transitionInterpolator: withoutAnimation
            ? undefined
            : new FlyToInterpolator(),
        }));
        setSelectedHexID(defaultHexID);
      }, 200);
    }
  }, [defaultHexID, withoutAnimation]);

  // Debounce to set center hexagon
  const debounceToSetCenterHex = debounce((viewState) => {
    if (viewState.zoom >= SHOW_HEXAGON_LAYER_FROM_ZOOM) {
      const hexID = geoToH3(viewState.latitude, viewState.longitude, 12);
      setCenterHex(hexID);
    }
  }, 100);

  const handleMapViewChange = useCallback(
    (params: ViewStateChangeParameters) => {
      if (params.viewState.zoom >= SHOW_HEXAGON_LAYER_FROM_ZOOM) {
        debounceToSetCenterHex(params.viewState);
      }
      if (mounted) {
        setViewState(params.viewState as MapViewState);
      }
    },
    [debounceToSetCenterHex, mounted],
  );

  const handleClickHexagon = useCallback(
    (pi: PickingInfo) => {
      if (pi.coordinate) {
        const hexID = geoToH3(pi.coordinate[1], pi.coordinate[0], 12);
        setSelectedHexID(hexID);
        setViewState({
          ...viewState,
          zoom: viewState.zoom + 0.001,
        });
        onVirtualEstateClick && onVirtualEstateClick(hexID);
      }
    },
    [onVirtualEstateClick, viewState],
  );

  return (
    <div className="w-full h-full">
      <DeckGL
        controller={true}
        initialViewState={viewState}
        layers={layers}
        onAfterRender={() => {
          setTimeout(() => {
            setMounted(true);
          }, 100);
        }}
        onClick={handleClickHexagon}
        onViewStateChange={handleMapViewChange}
      >
        <Map
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
