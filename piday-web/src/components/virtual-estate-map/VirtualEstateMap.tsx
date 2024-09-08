"use client";

import { useLazyGetClusterInAreaQuery } from "@/src/features/virtual-estate/api/virtualEstateAPI";
import { H3ClusterItem } from "@/src/features/virtual-estate/interface/virtual-estate.interface";
import { FlyToInterpolator, MapViewState } from "@deck.gl/core";
import { PickingInfo } from "@deck.gl/core";
import type { ViewStateChangeParameters } from "@deck.gl/core";
import { H3ClusterLayer, H3HexagonLayer } from "@deck.gl/geo-layers";
import { TextLayer } from "@deck.gl/layers";
import DeckGL from "@deck.gl/react";
import { ZoomWidget } from "@deck.gl/widgets";
import "@deck.gl/widgets/stylesheet.css";
import { geoToH3, h3ToGeo, kRing } from "h3-js";
import { debounce } from "lodash";

import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MapRef } from "react-map-gl";
import Map, { GeolocateControl, NavigationControl, useMap } from "react-map-gl";

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
  const mapRef = useRef<MapRef | null>(null);

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

  const h3Index = geoToH3(
    viewState.latitude,
    viewState.longitude,
    viewState.zoom,
  );

  const [clusterData, setClusterData] = useState<H3ClusterItem[]>([]);
  const [clusterMaxCount, setClusterMaxCount] = useState<number>(255);
  const [clusterDepth, setClusterDepth] = useState<number | null>(null);
  const [triggerGetCluster, clusterResult] = useLazyGetClusterInAreaQuery();

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
    let depth = 2;
    let hexID = "8212d7fffffffff";
    if (viewState.zoom > 0 && viewState.zoom <= 4) {
      depth = 2;
      hexID = geoToH3(viewState.latitude, viewState.longitude, 2);
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

    if (viewState.zoom < 14 && clusterDepth != depth) {
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
      // get max count from cluster
      const maxCount = Math.max(
        ...clusterResult.data.cluster.map((item) => item.count),
      );
      setClusterMaxCount(maxCount);

      setClusterData(clusterResult.data.cluster);
    }
  }, [clusterResult.data]);
  console.log(clusterData);

  useEffect(() => {
    console.log("?????/");
    console.log("cluster data:", clusterData);
    setLayers([
      hexagons &&
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
      clusterData &&
        clusterDepth &&
        new H3ClusterLayer<H3ClusterItem>({
          id: "H3ClusterLayer",
          data: clusterData,

          stroked: true,
          getHexagons: (d: H3ClusterItem) => d.hexIds,
          getFillColor: (d: H3ClusterItem) => {
            console.log((1 - d.count / clusterMaxCount) * 255);
            return [112, 48, 160, 70 + (d.count / clusterMaxCount) * 160];
          },
          getLineColor: [255, 255, 255, 100],
          lineWidthMinPixels: 1,
          pickable: true,
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
  }, [hexagons, onSaleList, selectedHexID, soldList, clusterData]);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceToSetCenterHex = useCallback(
    debounce((vs) => {
      if (vs.zoom >= SHOW_HEXAGON_LAYER_FROM_ZOOM) {
        const hexID = geoToH3(vs.latitude, vs.longitude, 12);
        if (hexID != centerHex) {
          setCenterHex(hexID);
          onCenterHexChange && onCenterHexChange(hexID);
        }
      }
    }, 1000),
    [],
  );

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
    (pi: PickingInfo, e: any) => {
      if (e.target.className == "deck-widget-icon") {
        return;
      }

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
    <div className="relative w-full h-full">
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
        widgets={[
          new ZoomWidget({
            id: "zoom",
            placement: "bottom-right",
            style: {
              margin: "21px",
              // position: "absolute",
              // right: "-20px",
              // bottom: "-20px",
              zIndex: "100",
            },
          }),
        ]}
        style={{
          // zIndex: "-1",
          position: "relative",
        }}
      >
        <Map
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken={token}
          id="pidayMap"
          ref={mapRef}
          // style={{
          //   position: "absolute",
          //   top: "0",
          //   left: "0",
          //   right: "0",
          //   bottom: "-50px",
          // }}
        >
          {/* <div style={{ position: "absolute", right: 10, top: 10 }}>
            <GeolocateControl
              position="bottom-left"
              style={{ zIndex: 110, position: "relative" }}
              trackUserLocation
            />
          </div>
          <NavigationControl position="bottom-right" /> */}
        </Map>
      </DeckGL>
      <div className="absolute top-4 m-4">
        <Card className=" w-max z-[1000]" size="sm">
          <div
            className="flex gap-2"
            onClick={() => {
              console.log(viewState);
            }}
          >
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
