import { atom } from "nanostores";
import type { Geopoint } from "./map-client";

export const $locationsByMap = atom<Record<string, Geopoint[]>>({});
export const $activeLocationSlugByMap = atom<Record<string, string | null>>({});

export function setLocations(mapId: string, locations: Geopoint[]) {
  $locationsByMap.set({
    ...$locationsByMap.get(),
    [mapId]: locations,
  });
}

export function addLocation(mapId: string, location: Geopoint) {
  const locationsByMap = $locationsByMap.get();
  const existingLocations = locationsByMap[mapId] ?? [];
  const existingIndex = existingLocations.findIndex(
    (currentLocation) => currentLocation.slug === location.slug,
  );

  const nextLocations = [...existingLocations];
  if (existingIndex >= 0) {
    nextLocations[existingIndex] = location;
  } else {
    nextLocations.push(location);
  }

  $locationsByMap.set({
    ...locationsByMap,
    [mapId]: nextLocations,
  });
}

export function clearLocations(mapId: string) {
  const locationsByMap = { ...$locationsByMap.get() };
  delete locationsByMap[mapId];
  $locationsByMap.set(locationsByMap);
}

export function getLocations(mapId: string) {
  return $locationsByMap.get()[mapId] ?? [];
}

export function setActiveLocationSlug(mapId: string, slug: string | null) {
  $activeLocationSlugByMap.set({
    ...$activeLocationSlugByMap.get(),
    [mapId]: slug,
  });
}

export function getActiveLocationSlug(mapId: string) {
  return $activeLocationSlugByMap.get()[mapId] ?? null;
}

export function getActiveLocation(mapId: string) {
  const slug = getActiveLocationSlug(mapId);
  if (!slug) return null;
  return getLocations(mapId).find((loc) => loc.slug === slug) || null;
}

export function clearActiveLocation(mapId: string) {
  setActiveLocationSlug(mapId, null);
}
