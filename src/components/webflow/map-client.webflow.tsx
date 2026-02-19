import { declareComponent } from "@webflow/react";
import { props } from "@webflow/data-types";
import LeafletMapInternal from "../map/map";
import { mapErrorDecorator } from "./map-error-decorator";

const MapClientWebflow = declareComponent(LeafletMapInternal, {
  name: "Map Client",
  description:
    "Leaflet map container scoped by map ID for pairing with map event items.",
  group: "Map Components",
  decorators: [mapErrorDecorator],
  props: {
    mapId: props.Text({
      name: "Map ID",
      tooltip: "Must match the Map Event Item mapId for linked interactions.",
      defaultValue: "map-1",
    }),
    defaultLat: props.Text({
      name: "Default Latitude",
      defaultValue: "48.4284",
    }),
    defaultLng: props.Text({
      name: "Default Longitude",
      defaultValue: "-123.3656",
    }),
    mapTileUrl: props.Text({
      name: "Tile URL",
      tooltip: "Leaflet tile URL template.",
      defaultValue:
        "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
    }),
  },
});

export default MapClientWebflow;
