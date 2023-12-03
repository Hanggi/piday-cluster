import { geoToH3 } from "h3-js";

export const getHexagonData = (mapBounds: any, zoomLevel: number) => {
  const h3Resolution = zoomLevelToH3Resolution(zoomLevel); // 将地图缩放级别转换为 H3 分辨率
  const hexagons = [];

  const step = 0.01; // 0.01 度约等于 1 公里

  // 计算地图视图内的 H3 六边形
  // 这里是伪代码，你需要根据地图边界实际计算
  for (let lat = mapBounds.south; lat <= mapBounds.north; lat += step) {
    for (let lng = mapBounds.west; lng <= mapBounds.east; lng += step) {
      const hexId = geoToH3(lat, lng, h3Resolution);
      hexagons.push({ hexId });
    }
  }

  return hexagons;
};

const zoomLevelToH3Resolution = (zoomLevel: number): number => {
  if (zoomLevel >= 0 && zoomLevel <= 4) {
    return 2; // 大范围视图
  } else if (zoomLevel >= 5 && zoomLevel <= 7) {
    return 4; // 市级视图
  } else if (zoomLevel >= 8 && zoomLevel <= 10) {
    return 6; // 街区级视图
  } else if (zoomLevel >= 11 && zoomLevel <= 13) {
    return 8; // 街道级视图
  } else if (zoomLevel >= 14 && zoomLevel <= 16) {
    return 10; // 建筑级视图
  } else if (zoomLevel >= 17 && zoomLevel <= 20) {
    return 12; // 房间级视图
  } else {
    return 15; // 最精细视图
  }
};
