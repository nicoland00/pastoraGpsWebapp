// app/test-wallet/page.tsx
"use client";

import dynamic from "next/dynamic";

const WalletMultiButtonDynamic = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

export default function TestWalletPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <WalletMultiButtonDynamic />
    </div>
  );
}
