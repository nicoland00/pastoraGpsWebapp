import "./globals.css";
import type { Metadata } from "next";
import React from "react";
import { LoteProvider } from "@/context/contextLote";
import OverlayLayout from "@/components/overlayLayout";
import Providers from "./providers";
import AccessOverlayWrapper from "@/components/AccessOverlayWrapper"; // si usas wrapper

export const metadata: Metadata = {
  title: "Pastora App",
  description: "Cattle tracking app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="h-screen w-screen overflow-hidden">
        <LoteProvider>
          <Providers>
            {/* Overlay de acceso */}
            <AccessOverlayWrapper />
            {/* Tu overlay layout (mapa, menú, etc.) */}
            <OverlayLayout>
              {children}
            </OverlayLayout>
          </Providers>
        </LoteProvider>
      </body>
    </html>
  );
}
