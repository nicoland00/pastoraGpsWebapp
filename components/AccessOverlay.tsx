"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import { useLote } from "@/context/contextLote";
import { motion } from "framer-motion";

const mainGreen = "#7AC78E"; // Use the vibrant green (#7AC78E)

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
        body: JSON.stringify({
          wallet: publicKey.toBase58(),
          userNFTs: nftMints,
        }),
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
      className="fixed inset-0 z-[200] flex flex-col items-center justify-flexstart pt-20 md:pt-8"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(6px)",
      }}
    >
      {/* Outer Title (above the square container) */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8 text-3xl md:pt-16 md:text-5xl font-extrabold text-center text-black"
      >
        Welcome to Pastora&apos;s Tracking Webapp
      </motion.h1>

      {/* Square Container */}
      <div
        className="relative bg-white rounded-2xl flex flex-col p-4 md:p-8 w-11/12 md:w-[750px] h-fit"
        style={{
          boxShadow: `0 4px 20px rgba(122, 199, 142, 0.6)`,
        }}
      >
        {/* Inner Header: Title and Subtitle */}
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl md:text-3xl font-semibold text-black mb-2"
          >
            Link the wallet with your claimed NFT
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-lg md:text-xl text-black mb-4"
          >
            Track your animals&apos; health, position and weight in real time!
          </motion.h3>
        </div>

        {/* Central Content */}
        <div className="flex flex-col items-center justify-flexstart flex-grow">
          {/* Image Container for responsive image behavior (shorter height) */}
          <div className="relative w-full md:h-[360px] h-[180px] mb-6">
            <Image
              src="/cows.gif"
              alt="Cows GIF"
              fill
              className="object-cover rounded-md"
            />
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={isVerifying}
            className="text-white font-semibold px-8 py-4 rounded-lg transition-colors disabled:opacity-70 w-11/12 max-w-xs"
            style={{ backgroundColor: mainGreen }}
          >
            {isVerifying ? "Verifying..." : "Verify"}
          </button>

          {/* Optional Message */}
          {message && (
            <p className="mt-6 text-center text-black text-xl">{message}</p>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
