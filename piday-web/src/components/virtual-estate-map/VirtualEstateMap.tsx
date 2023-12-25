"use client";

import { FlyToInterpolator, MapViewState } from "@deck.gl/core/typed";
import type { ViewStateChangeParameters } from "@deck.gl/core/typed/controllers/controller";
import { PickingInfo } from "@deck.gl/core/typed/lib/picking/pick-info";
import { H3HexagonLayer } from "@deck.gl/geo-layers/typed";
import { TextLayer } from "@deck.gl/layers/typed";
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

// Component

interface VirtualEstate {
  hexID: string;
}

interface Props {
  token: string;
  defaultHexID?: string;
  withoutAnimation?: boolean;

  onSaleList?: string[];
  soldList?: string[];

  onVirtualEstateClick?: (hexID: string) => void;
  onCenterHexChange?: (hexID: string) => void;
}

export default function VirtualEstateMap({
  token,
  defaultHexID,
  withoutAnimation,
  onSaleList,
  soldList,
  onVirtualEstateClick,
  onCenterHexChange,
}: Props) {
  const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE);
  const [hexagons, setHexagons] = useState<VirtualEstate[]>([]);
  // hexagonsCenter is the hexagon that is currently in the center of the hexagons array
  const [hexagonsCenter, setHexagonCenter] = useState<string>(""); // hex ID
  // centerHex is the hexagon that is currently in the center of the map
  const [centerHex, setCenterHex] = useState<string>(""); // hex ID
  // mounted is used to prevent the map from rendering before the hexagons are ready
  const [mounted, setMounted] = useState<boolean>(false);
  const [layers, setLayers] = useState<any[]>([]); // [H3HexagonLayer

  const [selectedHexID, setSelectedHexID] = useState<string>("");

  useEffect(() => {
    const ch = centerHex; // 示例中心六边形

    if (viewState.zoom >= SHOW_HEXAGON_LAYER_FROM_ZOOM) {
      if (ch == hexagonsCenter && hexagons.length > 0) {
        return;
      }
      const hexagonsMatirx = kRing(ch, 60).map((hex) => {
        return {
          hexID: hex,
        };
      });
      setHexagonCenter(ch);
      setHexagons(hexagonsMatirx as any);
    } else {
      if (hexagons.length != 0) {
        setHexagons([]);
      }
    }
  }, [centerHex, hexagons.length, hexagonsCenter, viewState.zoom]);

  useEffect(() => {
    setLayers([
      new H3HexagonLayer({
        id: "h3-hexagon-layer",
        data: hexagons,
        pickable: true,
        wireframe: true,
        extruded: false, // 确保六边形不是挤出的
        filled: true, // 使六边形为空心
        elevationScale: 1,
        getLineWidth: () => {
          return 0.1;
        },
        getText: () => {
          return "hihi";
        },
        getLineColor: (d) => {
          if (selectedHexID == d.hexID) {
            // returen yellow selected color
            return [255, 255, 0, 200];
          }

          // If hex ID is in onSale, return green
          if (onSaleList?.includes(d.hexID)) {
            return [0, 255, 0, 200];
          }

          if (soldList?.includes(d.hexID)) {
            return [255, 0, 0, 200];
          }

          return [112, 48, 160];
        }, // 设置六边形的边线颜色
        getHexagon: (d) => d.hexID, // 从数据对象中获取H3索引
        getFillColor: (d) => {
          if (selectedHexID == d.hexID) {
            return [112, 48, 160, 200];
          }

          // If hex ID is in onSale, return green
          if (onSaleList?.includes(d.hexID)) {
            return [0, 255, 0, 200];
          }

          if (soldList?.includes(d.hexID)) {
            return [112, 48, 160, 100];
          }

          return [255, 255, 255, 0];
        },
        // getElevation: (d) => 10, // 设置六边形的高度，仅当extruded为true时有效
        updateTriggers: {
          getFillColor: [selectedHexID, onSaleList, soldList],
        },
      }),
      new TextLayer({
        id: "h3-text-layer",
        data: hexagons,
        getPosition: (d) => d.coordinates,
        getText: (d) => {
          return "FFFFF";
          if (soldList?.includes(d.hexID)) {
            return "SOLD";
          }

          return "VV";
        },
        // getColor: [255, 255, 255, 1000], // 文本颜色
        getSize: 32,
        getAngle: 0,
        getTextAnchor: "middle",
        getAlignmentBaseline: "center",
        updateTriggers: {
          getText: [soldList],
        },
      }),
    ]);
    setViewState((vs) => {
      return {
        ...vs,
      };
    });
  }, [hexagons, onSaleList, selectedHexID, soldList]);

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
      }, 200);
    }
  }, [defaultHexID, withoutAnimation]);

  // Debounce to set center hexagon
  const debounceToSetCenterHex = debounce((vs) => {
    if (vs.zoom >= SHOW_HEXAGON_LAYER_FROM_ZOOM) {
      const hexID = geoToH3(vs.latitude, vs.longitude, 12);
      if (hexID != centerHex) {
        setCenterHex(hexID);
        onCenterHexChange && onCenterHexChange(hexID);
      }
    }
  }, 1000);

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
          }, 500);
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
