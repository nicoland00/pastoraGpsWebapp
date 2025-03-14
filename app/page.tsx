"use client";

import React from "react";
import { useLote } from "@/context/contextLote";
import dynamic from "next/dynamic";

// Dynamically import the MapComponent so it only loads client-side
const MapComponent = dynamic(() => import("@/app/components/MapComponent"), {
  ssr: false,
});

export default function Home() {
  const { selectedLote } = useLote();

  return (
    <div className="h-full w-full relative">
      {/* The map behind everything, full area */}
      <div className="absolute inset-0">
        <MapComponent />
      </div>
    </div>
  );
}
