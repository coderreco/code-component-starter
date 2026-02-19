"use client";

import * as React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css"; // Re-uses images from ~leaflet package
import * as L from "leaflet";
import "leaflet-defaulticon-compatibility";
import { MapPin as MapPinIcon } from "../common/map-pin";
import { renderToString } from "react-dom/server";
import {
  $locationsByMap,
  $activeLocationSlugByMap,
  setActiveLocationSlug,
} from "./mapstore";
import { useStore } from "@nanostores/react";

export type Geopoint = {
  slug: string;
  name: string;
  lat?: string;
  lng?: string;
  alt?: string;
  filterSlug?: string;
};

// Basic marker icon fix (you can swap URLs to your own assets)
const DefaultIcon = L.divIcon({
  html: renderToString(<MapPinIcon className="text-primary size-6 " />),
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconAnchor: [12, 12],
  popupAnchor: [1, -34],
  shadowSize: [24, 24],
});

const ActiveIcon = L.divIcon({
  html: renderToString(
    <MapPinIcon className="text-accent-foreground size-8" />,
  ),
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconAnchor: [16, 24],
  popupAnchor: [1, -38],
  shadowSize: [32, 32],
});

export type LeafletMapProps = {
  mapId: string;
  defaultLat?: string | null;
  defaultLng?: string | null;
  mapTileUrl?: string;
};

function getActiveFilterSlugFromUrl() {
  if (typeof window === "undefined") return null;
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get("area") ?? searchParams.get("county");
}

export default function LeafletMapInternal({
  mapId,
  defaultLat = null,
  defaultLng = null,
  mapTileUrl = "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
}: LeafletMapProps) {
  const locationsByMap = useStore($locationsByMap);
  const activeLocationSlugByMap = useStore($activeLocationSlugByMap);
  const locations = React.useMemo(
    () => locationsByMap[mapId] ?? [],
    [locationsByMap, mapId],
  );
  const activeSlug = activeLocationSlugByMap[mapId] ?? null;
  const [activeFilterSlug, setActiveFilterSlug] = React.useState<string | null>(
    () => getActiveFilterSlugFromUrl(),
  );

  React.useEffect(() => {
    const updateFilter = () => {
      setActiveFilterSlug(getActiveFilterSlugFromUrl());
    };

    window.addEventListener("popstate", updateFilter);
    window.addEventListener("map-filter-change", updateFilter);

    return () => {
      window.removeEventListener("popstate", updateFilter);
      window.removeEventListener("map-filter-change", updateFilter);
    };
  }, []);

  const filteredLocations = React.useMemo(() => {
    if (activeFilterSlug) {
      return locations.filter((loc) => loc.filterSlug === activeFilterSlug);
    }
    return locations;
  }, [activeFilterSlug, locations]);

  const defaultCenter: [number, number] =
    locations.length > 0 && locations[0].lat && locations[0].lng
      ? [
          parseFloat(locations[0].lat as string),
          parseFloat(locations[0].lng as string),
        ]
      : defaultLat && defaultLng
        ? [parseFloat(defaultLat), parseFloat(defaultLng)]
        : [49.30536273859448, -123.14493678310713]; // Default to Vancouver, BC

  if (typeof window === "undefined") {
    return (
      <div className="h-full w-full bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">Map is loading...</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={defaultCenter}
      zoom={10}
      scrollWheelZoom={false}
      className="h-full w-full"
      style={{ background: "#e5e5e5" }}
      zoomControl={false}
    >
      <ZoomControl position="bottomright" />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url={mapTileUrl}
      />

      <FlyToActiveLocation
        locations={filteredLocations}
        activeId={activeSlug}
      />

      {filteredLocations.map((loc) => {
        const { lat, lng } = loc;
        if (lat == null || lng == null) return null;

        const isActive = activeSlug === loc.slug;

        return (
          <Marker
            key={loc.slug}
            position={[parseFloat(lat), parseFloat(lng)]}
            icon={isActive ? ActiveIcon : DefaultIcon}
            eventHandlers={{
              click: () => setActiveLocationSlug(mapId, loc.slug),
            }}
          >
            <Popup>{loc.name}</Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

// Helper component to fly to active marker
function FlyToActiveLocation({
  locations,
  activeId,
}: {
  locations: Geopoint[];
  activeId: string | null;
}) {
  console.log("Flying to active location:", activeId);
  const map = useMap();

  React.useEffect(() => {
    if (!activeId) return;
    const loc = locations.find((l) => l.slug === activeId);
    if (!loc?.lat || !loc.lng) return;

    map.flyTo([parseFloat(loc.lat), parseFloat(loc.lng)], 12, {
      duration: 0.75,
    });
  }, [activeId, locations, map]);

  return null;
}
