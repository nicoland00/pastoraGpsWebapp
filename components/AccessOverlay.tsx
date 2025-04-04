"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import { useLote } from "@/context/contextLote";

export default function AccessOverlay() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [message, setMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const { publicKey, connected } = useWallet();
  const { setSelectedLote } = useLote();

  async function handleVerify() {
    if (!connected || !publicKey) {
      setMessage("Please connect your wallet.");
      return;
    }
    setIsVerifying(true);
    try {
      const resMints = await fetch("/api/get-nft-mints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicKey: publicKey.toBase58() }),
      });
      const mintsData = await resMints.json();
      if (!mintsData.success) {
        setMessage(mintsData.error || "Error getting NFT mints");
        return;
      }
      const nftMints = mintsData.nftMints;
      if (!nftMints || nftMints.length === 0) {
        setMessage("No NFTs found in your wallet.");
        return;
      }
      const resVerify = await fetch("/api/verify-nfts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: publicKey.toBase58(), userNFTs: nftMints }),
      });
      const verifyData = await resVerify.json();
      if (verifyData.success) {
        setSelectedLote(verifyData.ranchId);
        setIsAuthorized(true);
        setMessage("Welcome! RanchID: " + verifyData.ranchId);
      } else {
        setMessage("Sorry, you don't have an access token.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setMessage("Verification error.");
    } finally {
      setIsVerifying(false);
    }
  }

  useEffect(() => {
    if (connected && publicKey && !isAuthorized) {
      handleVerify();
    }
  }, [connected, publicKey, isAuthorized]);

  if (isAuthorized) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{
        backgroundColor: "rgba(0,50,0,0.7)", // Verde oscuro con opacidad 0.7
        backdropFilter: "blur(6px)",
      }}
    >
      {/* Navbar: Título Pastora */}
      <div className="absolute top-22 w-full text-center">
        <h1 className="text-5xl font-bold text-white">Pastora</h1>
        <h3 className="text-center text-xl mb-6 text-white pt-4">
          Tracking Webapp
        </h3>
      </div>

      {/* Cuadro blanco central */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl flex flex-col items-center mt-20">
        {/* Imagen/GIF placeholder (más grande) */}
        <div className="mb-6">
          <Image
            src="/cows.gif"
            alt="Cows GIF"
            width={400}
            height={300}
            className="rounded-lg"
          />
        </div>

        {/* Textos dentro del cuadro */}
        <p className="text-center text-2xl font-semibold mb-4 text-black">
          Link the wallet that contains your claimed NFT
        </p>

        {/* Botón Verify */}
        <button
          onClick={handleVerify}
          disabled={isVerifying}
          className="bg-black text-white font-semibold px-8 py-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-70 w-full max-w-xs"
        >
          {isVerifying ? "Verifying..." : "Verify"}
        </button>

        {/* Mensaje (opcional) */}
        {message && (
          <p className="mt-6 text-center text-black text-xl">
            {message}
          </p>
        )}
      </div>
    </div>,
    document.body
  );
}
