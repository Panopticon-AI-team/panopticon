import React from "react";

interface LayersProps {
    children: React.ReactNode;
}

export function MapLayers({ children}: Readonly<LayersProps>) {
  return <>{children}</>;
};
