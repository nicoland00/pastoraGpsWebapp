// app/components/MapComponent.tsx
"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useLote } from "@/context/contextLote";

// 1) Ajuste de los iconos por defecto de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
});

// 2) Obtenemos el token de Ixorigue desde las variables de entorno públicas
const IXORIGUE_TOKEN = process.env.NEXT_PUBLIC_IXORIGUE_TOKEN;

// 3) Tipado para los animales con coordenadas
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

// 4) Función para obtener un ícono aleatorio (por ejemplo, para representar una vaca)
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

// 5) Controles de zoom personalizados
function ZoomControls({ shift }: { shift?: boolean }) {
  const map = useMap();
  const handleZoomIn = () => map.zoomIn();
  const handleZoomOut = () => map.zoomOut();
  const leftOffset = shift ? "left-[285px]" : "left-[15px]";

  return (
    <div
      className={`
        absolute top-[90px] z-[9997]
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

// 6) Componente MapComponent final
export default function MapComponent({ sidebarOpen }: MapProps) {
  // En este contexto, "selectedLote" se utiliza para almacenar el ranchId dinámico
  const { selectedLote } = useLote();
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [animals, setAnimals] = useState<AnimalWithCoords[]>([]);

  // Si el usuario aún no ha seleccionado un ranchId (o lote), no se ejecuta el fetch.
  useEffect(() => {
    if (!selectedLote || selectedLote === "All") {
      return;
    }
    // A) Fetch de ranchos para obtener la ubicación central del mapa
    fetch("/api/ranches", {
      headers: { Authorization: `Bearer ${IXORIGUE_TOKEN}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error al obtener ranchos: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const ranchList = data?.data ?? [];
        // Busca el rancho cuyo id coincida con el ranchId seleccionado
        const myRanch = ranchList.find((r: any) => r.id === selectedLote);
        if (!myRanch) {
          console.error("Ranch no encontrado para el ranchId:", selectedLote);
          return;
        }
        setMapCenter([myRanch.location.latitude, myRanch.location.longitude]);
      })
      .catch((err) => console.error("Error al obtener ranchos:", err));
  }, [selectedLote]);

  // B) Fetch de animales, usando el ranchId seleccionado
  useEffect(() => {
    if (!mapCenter || !selectedLote || selectedLote === "All") return;
    fetch(`/api/animals/${selectedLote}`, {
      headers: { Authorization: `Bearer ${IXORIGUE_TOKEN}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error al obtener animales: ${res.status}`);
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
      .catch((err) => console.error("Error al obtener animales:", err));
  }, [mapCenter, selectedLote]);

  // Mientras no se obtenga la ubicación, muestra un loading
  if (!mapCenter) {
    return <div className="absolute top-0 left-0 p-4 text-white">Cargando mapa...</div>;
  }

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
