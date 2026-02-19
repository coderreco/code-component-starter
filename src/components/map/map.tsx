import * as React from "react";
import type { LeafletMapProps } from "./map-client";

export default function LeafletMapInternal(props: LeafletMapProps) {
  const [ClientComp, setClientComp] =
    React.useState<null | React.ComponentType<LeafletMapProps>>(null);
  const [loadError, setLoadError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    let alive = true;
    import("./map-client")
      .then((m) => {
        if (alive) setClientComp(() => m.default);
      })
      .catch((error) => {
        if (alive) {
          if (error instanceof Error) {
            setLoadError(error);
          } else {
            setLoadError(new Error("Failed to load map client"));
          }
        }
      });
    return () => {
      alive = false;
    };
  }, []);

  if (loadError) {
    throw loadError;
  }

  if (!ClientComp) {
    return (
      <div className="h-full w-full bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">Map is loading...</p>
      </div>
    );
  }

  return <ClientComp {...props} />;
}
