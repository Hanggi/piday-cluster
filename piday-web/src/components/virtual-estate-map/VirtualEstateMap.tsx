"use client";

import { useLazyGetClusterInAreaQuery } from "@/src/features/virtual-estate/api/virtualEstateAPI";
import { H3ClusterItem } from "@/src/features/virtual-estate/interface/virtual-estate.interface";
import { DeckProps } from "@deck.gl/core";
import { H3ClusterLayer, H3HexagonLayer } from "@deck.gl/geo-layers";
import { TextLayer } from "@deck.gl/layers";
import { MapboxOverlay } from "@deck.gl/mapbox";
import "@deck.gl/widgets/stylesheet.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { geoToH3, h3ToGeo, kRing } from "h3-js";
import { debounce } from "lodash";
import "maplibre-gl/dist/maplibre-gl.css";

import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";

import { useCallback, useEffect, useRef, useState } from "react";
// import type { MapLayerMouseEvent, MapRef } from "react-map-gl";
import { GeolocateControl, NavigationControl } from "react-map-gl";
import {
  Map,
  MapLayerMouseEvent,
  MapRef,
  useControl,
} from "react-map-gl/maplibre";

const SHOW_HEXAGON_LAYER_FROM_ZOOM = 15;

const INITIAL_VIEW_STATE = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 3,
  pitch: 0,
  bearing: 0,
};

// Component

// function DeckGLOverlay(props: DeckProps) {
//   const overlay = useControl<any>(() => new MapboxOverlay(props));
//   overlay.setProps(props);
//   return null;
// }

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
  const mapRef = useRef<MapRef | null>(null);

  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [hexagons, setHexagons] = useState<VirtualEstate[]>([]);
  const [hexagonsCenter, setHexagonCenter] = useState<string>("");
  const [centerHex, setCenterHex] = useState<string>("");
  const [mounted, setMounted] = useState<boolean>(false);
  const [selectedHexID, setSelectedHexID] = useState<string>("");

  const [clusterData, setClusterData] = useState<H3ClusterItem[]>([]);
  const [clusterMaxCount, setClusterMaxCount] = useState<number>(255);
  const [clusterDepth, setClusterDepth] = useState<number | null>(null);
  const [triggerGetCluster, clusterResult] = useLazyGetClusterInAreaQuery();

  // 初始化 MapboxOverlay
  const overlay = useRef<MapboxOverlay | null>(null);

  useEffect(() => {
    const ch = centerHex;
    if (viewState.zoom >= SHOW_HEXAGON_LAYER_FROM_ZOOM) {
      if (ch == hexagonsCenter && hexagons.length > 0) {
        return;
      }
      const hexagonsMatrix = kRing(ch, 60).map((hex) => ({
        hexID: hex,
      }));
      setHexagonCenter(ch);
      setHexagons(hexagonsMatrix);
    } else {
      if (hexagons.length !== 0) {
        setHexagons([]);
      }
    }
  }, [centerHex, hexagons.length, hexagonsCenter, viewState.zoom]);

  useEffect(() => {
    let depth = 2;
    let hexID = geoToH3(viewState.latitude, viewState.longitude, 2);
    if (viewState.zoom > 0 && viewState.zoom <= 4) {
      depth = 2;
      setClusterDepth(2);
    } else if (viewState.zoom > 4 && viewState.zoom <= 6) {
      depth = 4;
      hexID = geoToH3(viewState.latitude, viewState.longitude, 4);
      setClusterDepth(4);
    } else if (viewState.zoom > 6 && viewState.zoom <= 9) {
      depth = 6;
      hexID = geoToH3(viewState.latitude, viewState.longitude, 6);
      setClusterDepth(6);
    } else if (viewState.zoom > 9 && viewState.zoom <= 11) {
      depth = 8;
      hexID = geoToH3(viewState.latitude, viewState.longitude, 8);
      setClusterDepth(8);
    } else if (viewState.zoom > 11 && viewState.zoom <= 12) {
      depth = 10;
      hexID = geoToH3(viewState.latitude, viewState.longitude, 10);
      setClusterDepth(10);
    } else if (viewState.zoom > 12 && viewState.zoom <= 15) {
      depth = 12;
      hexID = geoToH3(viewState.latitude, viewState.longitude, 12);
      setClusterDepth(12);
    } else {
      setClusterDepth(null);
    }

    if (viewState.zoom < 14 && clusterDepth !== depth) {
      triggerGetCluster({
        hexID: hexID,
        depth,
      });
    }
  }, [
    triggerGetCluster,
    viewState.latitude,
    viewState.longitude,
    viewState.zoom,
  ]);

  useEffect(() => {
    if (clusterResult.data) {
      const maxCount = Math.max(
        ...clusterResult.data.cluster.map((item) => item.count),
      );
      setClusterMaxCount(maxCount);
      setClusterData(clusterResult.data.cluster);
    }
  }, [clusterResult.data]);

  useEffect(() => {
    const layers = [
      hexagons.length > 0 &&
        new H3HexagonLayer({
          id: "h3-hexagon-layer",
          data: hexagons,
          pickable: true,
          wireframe: true,
          extruded: false,
          filled: true,
          elevationScale: 1,
          getLineWidth: () => 0.1,
          getText: () => "hihi",
          getLineColor: (d) => {
            if (selectedHexID === d.hexID) {
              return [255, 255, 0, 200];
            }
            if (onSaleList?.includes(d.hexID)) {
              return [0, 255, 0, 200];
            }
            if (soldList?.includes(d.hexID)) {
              return [255, 0, 0, 200];
            }
            return [112, 48, 160];
          },
          getHexagon: (d) => d.hexID,
          getFillColor: (d) => {
            if (selectedHexID === d.hexID) {
              return [112, 48, 160, 200];
            }
            if (onSaleList?.includes(d.hexID)) {
              return [0, 255, 0, 200];
            }
            if (soldList?.includes(d.hexID)) {
              return [112, 48, 160, 100];
            }
            return [255, 255, 255, 0];
          },
          updateTriggers: {
            getFillColor: [selectedHexID, onSaleList, soldList],
          },
        }),
      clusterData.length > 0 &&
        clusterDepth &&
        new H3ClusterLayer<H3ClusterItem>({
          id: "H3ClusterLayer",
          data: clusterData,
          stroked: true,
          getHexagons: (d: H3ClusterItem) => d.hexIds,
          getFillColor: (d: H3ClusterItem) => [
            112,
            48,
            160,
            70 + (d.count / clusterMaxCount) * 160,
          ],
          getLineColor: [255, 255, 255, 100],
          lineWidthMinPixels: 1,
          pickable: true,
        }),
      new TextLayer({
        id: "h3-text-layer",
        data: hexagons,
        getPosition: (d) => d.coordinates,
        getText: (d) => {
          if (soldList?.includes(d.hexID)) {
            return "SOLD";
          }
          return "VV";
        },
        getSize: 32,
        getTextAnchor: "middle",
        getAlignmentBaseline: "center",
        updateTriggers: {
          getText: [soldList],
        },
      }),
    ];

    // 初始化 MapboxOverlay 并传入 layers
    if (!overlay.current) {
      overlay.current = new MapboxOverlay({ layers: layers } as any);
    } else {
      overlay.current.setProps({ layers: layers } as any);
    }
  }, [hexagons, onSaleList, selectedHexID, soldList, clusterData]);

  useEffect(() => {
    if (defaultHexID) {
      const target = h3ToGeo(defaultHexID);
      setSelectedHexID(defaultHexID);
      setCenterHex(defaultHexID);

      setTimeout(() => {
        if (withoutAnimation) {
          mapRef.current?.jumpTo({
            center: [target[1], target[0]], // 经度和纬度
            zoom: 17, // 目标缩放级别
          });
        } else {
          mapRef.current?.flyTo({
            center: [target[1], target[0]], // 经度和纬度
            zoom: 17, // 目标缩放级别
            speed: 2.5, // 速度（越大越快）
            curve: 1, // 动画曲线的弯曲程度（越大越平滑）
            easing: (t) => t, // 自定义动画缓动函数
            essential: true, // 如果是 false，则地图在用户交互期间会中断飞行动画
          });
        }
      }, 200);
    }
  }, [defaultHexID, withoutAnimation]);

  const debounceToSetCenterHex = useCallback(
    debounce((vs) => {
      if (vs.zoom >= SHOW_HEXAGON_LAYER_FROM_ZOOM) {
        const hexID = geoToH3(vs.latitude, vs.longitude, 12);
        if (hexID !== centerHex) {
          setCenterHex(hexID);
          onCenterHexChange && onCenterHexChange(hexID);
        }
      }
    }, 1000),
    [],
  );

  const handleMapViewChange = useCallback(
    (params: any) => {
      if (params.viewState.zoom >= SHOW_HEXAGON_LAYER_FROM_ZOOM) {
        debounceToSetCenterHex(params.viewState);
      }
      setViewState(params.viewState);
      // if (mounted) {
      // }
    },
    [debounceToSetCenterHex, mounted],
  );

  const handleClickHexagon = useCallback(
    (e: MapLayerMouseEvent) => {
      // if (e.target.className === "deck-widget-icon") {
      //   return;
      // }
      if (e.lngLat) {
        const hexID = geoToH3(e.lngLat.lat, e.lngLat.lng, 12);
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
    <div className="relative w-full h-full">
      <Map
        initialViewState={viewState}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        mapboxAccessToken={token}
        ref={mapRef}
        style={{ position: "relative" }}
        onClick={handleClickHexagon}
        onLoad={() => {
          if (overlay.current) {
            mapRef.current?.getMap().addControl(overlay.current as any);
          }
        }}
        onMove={(evt) => handleMapViewChange({ viewState: evt.viewState })}
      >
        <div style={{ position: "absolute", right: 10, top: 10 }}>
          <GeolocateControl
            position="bottom-left"
            style={{ zIndex: 110, position: "relative" }}
            trackUserLocation
          />
        </div>
        <NavigationControl position="bottom-right" />

        {/* <GeocoderControl mapboxAccessToken={token} position="top-right" /> */}
      </Map>

      {/* <DeckGL
        initialViewState={{
          longitude: 0.45,
          latitude: 51.47,
          zoom: 11,
        }}
        controller
        layers={layers}
      >
        <Map mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" />
      </DeckGL> */}

      <div className="absolute top-4 ml-4 mt-0 hidden lg:block">
        <Card className="w-max z-[1000]" size="sm">
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
    </div>
  );
}
