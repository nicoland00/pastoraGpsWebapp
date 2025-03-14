// selectLote.tsx
"use client";

import React from "react";
import { useLote } from "@/context/contextLote";

export default function SelectLote() {
  const { selectedLote, setSelectedLote } = useLote();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLote(e.target.value);
  };

  return (
    <div id="selectLoteContainer">
      <label htmlFor="loteSelect" className="lote-label">
        Lote:
      </label>
      <select
        id="loteSelect"
        value={selectedLote}
        onChange={handleChange}
      >
        <option value="All">Todos</option>
        <option value="Lote San Sebastian">San Sebastian</option>
        <option value="Lote Cayo Arena">Cayo Arena</option>
      </select>
    </div>
  );
}
