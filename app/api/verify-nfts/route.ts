// app/api/verify-nfts/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Contrato from '@/models/Contrato';

export async function POST(request: Request) {
  try {
    // Conexión a MongoDB
    await dbConnect();

    // Obtén todos los documentos en la colección Contratos
    const allDocs = await Contrato.find().lean();
    console.log("TODOS LOS DOCUMENTOS EN BD:", allDocs);

    const body = await request.json();
    console.log("verify-nfts body:", body);

    const { userNFTs } = body;
    console.log("userNFTs:", userNFTs);

    if (!Array.isArray(userNFTs) || userNFTs.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No NFT mints provided' },
        { status: 400 }
      );
    }

    // Busca si alguno de los userNFTs coincide con nftMint en la BD
    const contrato = await Contrato.findOne({ nftMint: { $in: userNFTs } });
    if (!contrato) {
      console.log("No matching NFT found in DB for mints:", userNFTs);
      return NextResponse.json(
        { success: false, error: 'No matching NFT found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      ranchId: contrato.ranchId,
      contractId: contrato.contractId,
    });
  } catch (error: any) {
    console.error("Error en /api/verify-nfts:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
