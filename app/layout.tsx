// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import React from "react";
import { LoteProvider } from "@/context/contextLote";
import OverlayLayout from "@/components/overlayLayout";

export const metadata: Metadata = {
  title: "Pastora App",
  description: "Ixorigue integration with side nav & map/stats pages",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="h-screen w-screen overflow-hidden">
        <LoteProvider>
          <OverlayLayout>{children}</OverlayLayout>
        </LoteProvider>
      </body>
    </html>
  );
}
