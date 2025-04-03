// app/page.tsx
"use client";

import React from "react";
import Providers from "./providers";
import dynamic from "next/dynamic";
import OverlayLayout from "@/components/overlayLayout";

const AccessOverlayDynamic = dynamic(
  () => import("@/components/AccessOverlay"),
  { ssr: false }
);

export default function HomePage() {
  return (
    <Providers>
      <AccessOverlayDynamic />
      <OverlayLayout>
        <></>
      </OverlayLayout>
    </Providers>
  );
}
