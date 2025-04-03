// app/components/AccessOverlay.tsx
"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useLote } from "@/context/contextLote";

export default function AccessOverlay() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [message, setMessage] = useState("");
  const { publicKey, connected } = useWallet();
  const { setSelectedLote } = useLote();

  async function handleVerify() {
    if (!connected || !publicKey) {
      setMessage("Por favor, conecta tu wallet.");
      return;
    }
    try {
      // 1. Llama al endpoint para obtener los NFT mints de la wallet
      const resMints = await fetch("/api/get-nft-mints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicKey: publicKey.toBase58() }),
      });
      const mintsData = await resMints.json();
      if (!mintsData.success) {
        setMessage(mintsData.error || "Error obteniendo NFT mints");
        return;
      }
      const nftMints = mintsData.nftMints;
      if (!nftMints || nftMints.length === 0) {
        setMessage("No se encontraron NFTs en tu wallet.");
        return;
      }
      // 2. Llama al endpoint para verificar los NFT mints en la BD
      const resVerify = await fetch("/api/verify-nfts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: publicKey.toBase58(), userNFTs: nftMints }),
      });
      const verifyData = await resVerify.json();
      if (verifyData.success) {
        setSelectedLote(verifyData.ranchId);
        setIsAuthorized(true);
        setMessage("¡Bienvenido! RanchID: " + verifyData.ranchId);
      } else {
        setMessage("Lo siento, no tienes ningún token de acceso.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setMessage("Error en la verificación.");
    }
  }

  useEffect(() => {
    if (connected && publicKey && !isAuthorized) {
      handleVerify();
    }
  }, [connected, publicKey, isAuthorized]);

  if (isAuthorized) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.7)",
      color: "#fff",
      zIndex: 9998,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <h2>Conecta tu wallet para verificar acceso</h2>
      <button onClick={handleVerify} style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}>
        Verificar NFT
      </button>
      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </div>
  );
}
