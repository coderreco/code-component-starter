import { declareComponent } from "@webflow/react";
import { props } from "@webflow/data-types";
import MapItem from "../map/map-button";

const MapEventItemWebflow = declareComponent(MapItem, {
  name: "Map Event Item",
  description:
    "A map-linked event row that registers a location and syncs active state by map ID.",
  group: "Map Components",
  props: {
    mapId: props.Text({
      name: "Map ID",
      tooltip: "Shared ID between map and list items for one map instance.",
      defaultValue: "map-1",
    }),
    slug: props.Text({
      name: "Location Slug",
      defaultValue: "event-1",
    }),
    name: props.Text({
      name: "Title",
      defaultValue: "Willows Beach",
    }),
    lat: props.Text({
      name: "Latitude",
      defaultValue: "48.4220",
    }),
    lng: props.Text({
      name: "Longitude",
      defaultValue: "-123.3656",
    }),
    alt: props.Text({
      name: "Alt Text",
      defaultValue: "Beach location",
    }),
    filterSlug: props.Text({
      name: "Filter Slug",
      defaultValue: "victoria",
    }),
    eventDate: props.Text({
      name: "Event Date",
      tooltip: "ISO date string or parseable date (e.g. 2026-03-08).",
      defaultValue: "2026-03-08",
    }),
    timeRange: props.Text({
      name: "Time Range",
      defaultValue: "11:00am–1:00pm",
    }),
    status: props.Text({
      name: "Status",
      defaultValue: "Upcoming",
    }),
  },
});

export default MapEventItemWebflow;
