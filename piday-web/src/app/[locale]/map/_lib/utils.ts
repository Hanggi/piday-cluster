import { WebMercatorViewport } from "@deck.gl/core/typed";
import { polyfill } from "h3-js";

export function bboxFromViewport(viewport: any) {
  const { width, height } = viewport;
  const projection = new WebMercatorViewport(viewport);

  const [west, north] = projection.unproject([0, 0]);
  const [east, south] = projection.unproject([width, height]);

  return { north, south, east, west };
}

export function getH3IndicesForBB(
  { north, south, east, west }: any,
  resolution = 10,
) {
  const nw = [north, west];
  const ne = [north, east];
  const sw = [south, west];
  const se = [south, east];

  const hexes = polyfill([nw, ne, se, sw], resolution);

  return hexes;
}
