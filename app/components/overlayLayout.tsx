"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import SideNavbar from "./sideNavbar";
import SelectLote from "./selectLote";

// Dynamically import the Leaflet map so it only renders client-side
// We'll pass a "sidebarOpen" prop to it
const MapComponent = dynamic(() => import("./MapComponent"), { ssr: false });

export default function OverlayLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // We'll shift the "Lote" box left or right depending on sidebar state
  const loteLeft = sidebarOpen ? "left-[285px]" : "left-[90px]";

  return (
    <div className="relative h-screen w-screen">
      {/* 1) Page content behind everything: the map + children if needed */}
      <div className="absolute inset-0 z-0">
        {/* Pass sidebarOpen to the map so it can shift zoom controls */}
        <MapComponent sidebarOpen={sidebarOpen} />
        {children}
      </div>

      {/* 2) Hamburger button */}
      { /* Keep the button always in the DOM, but fade out when open */ }
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`
            absolute top-[15px] left-[15px] z-20
            bg-white text-black p-3 rounded-[20px]
            hover:bg-gray-200 transition-all duration-300
            ${sidebarOpen ? "opacity-0 pointer-events-none" : "opacity-100"}
          `}
          aria-label="Toggle Menu"
        >
        <svg
          className="w-10 h-10"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* 3) The "Select Lote" box, shifting left if sidebar is open */}
      <div
        className={`
          absolute top-[15px] z-20
          bg-white/75 rounded-[20px] p-3
          transition-all duration-300
          ${loteLeft}
        `}
      >
        <SelectLote />
      </div>

      {/* 4) The side navbar overlay */}
      <SideNavbar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
}
