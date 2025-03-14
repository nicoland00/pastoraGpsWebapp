"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type LoteContextType = {
  selectedLote: string;
  setSelectedLote: (value: string) => void;
};

const LoteContext = createContext<LoteContextType | undefined>(undefined);

export function LoteProvider({ children }: { children: ReactNode }) {
  const [selectedLote, setSelectedLote] = useState("All");

  return (
    <LoteContext.Provider value={{ selectedLote, setSelectedLote }}>
      {children}
    </LoteContext.Provider>
  );
}

export function useLote() {
  const context = useContext(LoteContext);
  if (!context) {
    throw new Error("useLote must be used within a LoteProvider");
  }
  return context;
}
