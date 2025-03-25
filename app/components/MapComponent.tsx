"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// 1) Ajustar iconos por defecto
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
});

// 2) Variables (en duro o .env)
const IXORIGUE_TOKEN = "TU_TOKEN";
const RANCH_ID = "89228e7c-6e99-492e-b085-b06edfc731b5";

interface AnimalWithCoords {
  id: string;
  name: string;
  lat: number;
  lng: number;
  weight?: number | null;
}

interface MapProps {
  sidebarOpen?: boolean;
}

// 3) Función para ícono aleatorio
function getRandomCowIcon(): L.Icon {
  const cowImages = ["/cows/2.png", "/cows/5.png", "/cows/8.png", "/cows/11.png"];
  const randomImage = cowImages[Math.floor(Math.random() * cowImages.length)];
  return L.icon({
    iconUrl: randomImage,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
}

// 4) ZoomControls
function ZoomControls({ shift }: { shift?: boolean }) {
  const map = useMap();
  const handleZoomIn = () => map.zoomIn();
  const handleZoomOut = () => map.zoomOut();
  const leftOffset = shift ? "left-[285px]" : "left-[15px]";

  return (
    <div
      className={`
        absolute top-[90px] z-[9999]
        flex flex-col gap-2 p-2 bg-white/75 text-black rounded-[20px]
        transition-all duration-300
        ${leftOffset}
      `}
    >
      <button
        onClick={handleZoomIn}
        className="w-10 h-10 flex items-center justify-center rounded-[20px] hover:bg-gray-200"
      >
        +
      </button>
      <button
        onClick={handleZoomOut}
        className="w-10 h-10 flex items-center justify-center rounded-[20px] hover:bg-gray-200"
      >
        -
      </button>
    </div>
  );
}

// 5) Componente principal
export default function MapComponent({ sidebarOpen }: MapProps) {
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [animals, setAnimals] = useState<AnimalWithCoords[]>([]);

  // A) Fetch ranch => center
  useEffect(() => {
    fetch("/api/ranches", {
      headers: { Authorization: `Bearer ${IXORIGUE_TOKEN}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Fetch ranches error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const ranchList = data?.data ?? [];
        const myRanch = ranchList.find((r: any) => r.id === RANCH_ID);
        if (!myRanch) {
          console.error("Ranch not found!");
          return;
        }
        setMapCenter([myRanch.location.latitude, myRanch.location.longitude]);
      })
      .catch((err) => console.error("Map fetch ranches error:", err));
  }, []);

  // B) Fetch animals
  useEffect(() => {
    if (!mapCenter) return;
    fetch(`/api/animals/${RANCH_ID}`, {
      headers: { Authorization: `Bearer ${IXORIGUE_TOKEN}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Fetch animals error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const list = data?.data ?? [];
        const coords: AnimalWithCoords[] = list
          .filter((an: any) => an.lastLocation)
          .map((an: any) => ({
            id: an.id,
            name: an.name || an.earTag || "Vaca",
            lat: an.lastLocation.latitude,
            lng: an.lastLocation.longitude,
            weight: an.lastWeight?.weight ?? null,
          }));
        setAnimals(coords);
      })
      .catch((err) => console.error("Map fetch animals error:", err));
  }, [mapCenter]);

  // C) Loading
  if (!mapCenter) {
    return <div className="absolute top-0 left-0 p-4 text-white">Loading map...</div>;
  }

  // D) Render
  return (
    <MapContainer center={mapCenter} zoom={14} style={{ height: "100%", width: "100%" }} zoomControl={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.esri.com/">Esri</a> & contributors'
        url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />
      {animals.map((a) => (
        <Marker key={a.id} position={[a.lat, a.lng]} icon={getRandomCowIcon()}>
          <Popup>
            <strong>{a.name}</strong>
            <br />
            {a.weight ? `Peso: ${a.weight} kg` : "Peso desconocido"}
          </Popup>
        </Marker>
      ))}

      <ZoomControls shift={sidebarOpen} />
    </MapContainer>
  );
}
