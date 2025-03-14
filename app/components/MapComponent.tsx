"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix default icon paths so Leaflet loads icons from /public/
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
});

interface MapProps {
  sidebarOpen?: boolean;
}

// A small custom zoom control that MUST be inside <MapContainer>
function ZoomControls({ shift }: { shift?: boolean }) {
  const map = useMap();

  const handleZoomIn = () => map.zoomIn();
  const handleZoomOut = () => map.zoomOut();

  // Decide which Tailwind class to use for left offset
  // shift ? left-[285px] : left-[20px]
  const leftOffsetClass = shift ? "left-[285px]" : "left-[15px]";

  return (
    <div
      className={`
        absolute top-[90px] z-[9999]
        flex flex-col gap-2 p-2 bg-white/75 text-black rounded-[20px]
        transition-all duration-300
        ${leftOffsetClass}
      `}
    >
      <button
        onClick={handleZoomIn}
        className="w-10 h-10 flex items-center justify-center rounded-[20px] hover:bg-white-200"
      >
        +
      </button>
      <button
        onClick={handleZoomOut}
        className="w-10 h-10 flex items-center justify-center rounded-[20px] hover:bg-white-200"
      >
        -
      </button>
    </div>
  );
}


export default function MapComponent({ sidebarOpen }: MapProps) {
  useEffect(() => {
    // Just to ensure we run in the client
  }, []);

  return (
    <MapContainer
      center={[10, -70]}
      zoom={8}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false} // disable default Leaflet +/-
    >
    
    
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Example marker */}
      <Marker position={[10, -70]}>
        <Popup>Hello from Pastora!</Popup>
      </Marker>

      {/* Our custom zoom buttons, shifting left if sidebar is open */}
      <ZoomControls shift={sidebarOpen} />
    </MapContainer>
  );
}
