// app/components/OverlayLayout.tsx
"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import SideNavbar from "./sideNavbar";
import SelectLote from "./selectLote";

// Lazy-load the map so it only runs on the client
const MapComponent = dynamic(() => import("./MapComponent"), { ssr: false });

export default function OverlayLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Determine if we are on the stats route (to change background and hide the X button)
  const isStats = pathname === "/stats" || pathname.startsWith("/stats");

  // Shift the "Lote" box depending on sidebar state
  const loteLeft = sidebarOpen ? "left-[285px]" : "left-[90px]";

  // Use fully white background on stats, or semi-transparent on other pages
  const loteBgClass = isStats ? "bg-white" : "bg-white/75";

  // Determine if we are on the home route (where the map should be visible)
  const isHome = pathname === "/";

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Map container: only show on home; its container has z-0 so it stays behind overlays */}
      {isHome && (
        <div className="absolute inset-0 z-0">
          <MapComponent sidebarOpen={sidebarOpen} />
        </div>
      )}

      {/* Main page content (such as Stats) goes in a relative container with a higher z-index */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Hamburger button: always visible on top with high z-index */}
      <button
        onClick={() => setSidebarOpen(true)}
        className={`
          absolute top-[15px] left-[15px] z-50
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

      {/* Lote selector box: positioned with a dynamic left offset */}
      <div
        className={`
          absolute top-[15px] z-50
          ${loteBgClass} rounded-[20px] p-3
          transition-all duration-300
          ${loteLeft}
        `}
      >
        <SelectLote />
      </div>

      {/* Side navbar overlay */}
      <SideNavbar open={sidebarOpen} onClose={() => setSidebarOpen(false)} isStats={isStats} />
    </div>
  );
}
