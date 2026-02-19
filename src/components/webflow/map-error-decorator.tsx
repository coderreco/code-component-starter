import * as React from "react";

type MapErrorBoundaryProps = {
  children: React.ReactNode;
};

type MapErrorBoundaryState = {
  hasError: boolean;
};

class MapErrorBoundary extends React.Component<
  MapErrorBoundaryProps,
  MapErrorBoundaryState
> {
  state: MapErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): MapErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Map component rendering error", { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full min-h-40 w-full items-center justify-center rounded-md border border-destructive/40 bg-destructive/10 p-4 text-center text-sm text-foreground">
          Unable to render map right now.
        </div>
      );
    }

    return this.props.children;
  }
}

export const mapErrorDecorator = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
): React.ComponentType<P> => {
  const DecoratedComponent = (props: P) => (
    <MapErrorBoundary>
      <WrappedComponent {...props} />
    </MapErrorBoundary>
  );

  DecoratedComponent.displayName = `MapErrorDecorated(${WrappedComponent.displayName ?? WrappedComponent.name ?? "Component"})`;

  return DecoratedComponent;
};
