import { cn } from "@/lib/utils";
import * as React from "react";
import { Badge } from "../ui/badge";
import type { Geopoint } from "./map-client";
import { addLocation, setActiveLocationSlug } from "./mapstore";

type EventStatus = "complete" | "upcoming" | "default";

function getDateParts(eventDate?: string) {
  if (!eventDate) return null;
  const date = new Date(eventDate);
  if (Number.isNaN(date.getTime())) return null;

  return {
    weekday: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
      date,
    ),
    day: new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(date),
    monthYear: new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
    }).format(date),
    longDate: new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date),
  };
}

function ClockGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-5", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5l3.25 2" />
    </svg>
  );
}

type MapEventItemProps = Geopoint & {
  mapId: string;
  eventDate?: string;
  timeRange?: string;
  status?: string;
  children?: React.ReactNode;
};

export default function MapItem({
  mapId,
  slug,
  name,
  lat,
  lng,
  alt,
  eventDate,
  timeRange,
  status,
  children,
  filterSlug,
}: MapEventItemProps) {
  const dateParts = getDateParts(eventDate);
  const normalizedStatus = (status?.toLowerCase() ?? "default") as EventStatus;

  const handleClick = () => {
    setActiveLocationSlug(mapId, slug);
  };

  React.useEffect(() => {
    if (!lat || !lng) return;
    addLocation(mapId, { slug, name, lat, lng, alt, filterSlug });
  }, [alt, filterSlug, lat, lng, mapId, name, slug]);

  return (
    <div
      data-location-slug={slug}
      data-name={name}
      onClick={handleClick}
      className="grid w-full cursor-pointer grid-cols-[min-content_auto_min-content] items-center gap-4 border-b border-border/60 bg-muted/30 p-4 hover:bg-primary/10"
    >
      <div className="grid min-w-20 place-items-center border-r border-border/60 pr-4 text-center">
        <p className="text-2xl leading-none font-semibold">
          {dateParts?.day ?? "—"}
        </p>
        <p className="text-sm font-medium uppercase">
          {dateParts?.weekday ?? "TBD"}
        </p>
        <p className="text-sm">{dateParts?.monthYear ?? ""}</p>
      </div>

      <div className="min-w-0 py-1">
        <h3 className="text-xl font-semibold">{name}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-base">
          <div className="inline-flex items-center gap-2">
            <ClockGlyph />
            <span>{dateParts?.longDate ?? "Date TBD"}</span>
          </div>
          <span>{timeRange ?? "Time TBD"}</span>
        </div>
      </div>

      {children ? (
        <div>{children}</div>
      ) : (
        <Badge
          variant={normalizedStatus === "upcoming" ? "default" : "outline"}
          className={cn(
            "h-7 px-3 text-sm",
            normalizedStatus === "complete" &&
              "border-primary/50 text-foreground",
          )}
        >
          {status ?? "Upcoming"}
        </Badge>
      )}
    </div>
  );
}

export const FilterItem = ({
  filterSlug,
  name,
}: {
  filterSlug: string;
  name: string;
}) => {
  const filterIsActive = (() => {
    const searchParams = new URLSearchParams(window.location.search);
    const currentFilter =
      searchParams.get("area") ?? searchParams.get("county");
    return currentFilter === filterSlug;
  })();

  const handleClick = () => {
    const searchParams = new URLSearchParams(window.location.search);
    if (filterSlug && !filterIsActive) {
      searchParams.set("area", filterSlug);
      searchParams.delete("county");
    } else {
      searchParams.delete("area");
      searchParams.delete("county");
    }

    const queryString = searchParams.toString();
    const newUrl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      (queryString ? `?${queryString}` : "");

    window.history.replaceState({ path: newUrl }, "", newUrl);
    window.dispatchEvent(new Event("map-filter-change"));
  };

  return (
    <div
      data-filter-slug={filterSlug}
      data-name={name}
      onClick={handleClick}
      className={cn(
        "px-4 py-2 border-b cursor-pointer hover:bg-primary/10",
        filterIsActive && "bg-primary/20 font-semibold",
      )}
    >
      {/* Text area */}
      <h3 className="font-semibold text-sm">{name}</h3>
    </div>
  );
};
