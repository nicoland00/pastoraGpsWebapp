import { Metadata } from "next";
import "./globals.css";
import { LoteProvider } from "@/context/contextLote";
import OverlayLayout from "./components/overlayLayout";

export const metadata: Metadata = {
  title: "Pastora",
  description: "Full-screen map with overlays",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen w-screen overflow-hidden">
        <LoteProvider>
          {/* OverlayLayout places the hamburger, sidebar, and select-lote box over the page */}
          <OverlayLayout>{children}</OverlayLayout>
        </LoteProvider>
      </body>
    </html>
  );
}
