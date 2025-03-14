"use client";

import React from "react";
import { useLote } from "@/context/contextLote";

export default function StatsPage() {
  const { selectedLote } = useLote();

  return (
    <div className="h-full w-full bg-blue-700 flex items-center justify-center">
      <div className="text-white text-center">
        <h1 className="text-3xl font-bold">Estadísticas</h1>
        <p className="mt-2">
          Mostrando datos para lote: <strong>{selectedLote}</strong>
        </p>
      </div>
    </div>
  );
}
