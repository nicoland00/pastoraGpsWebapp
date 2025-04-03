// app/api/ranches/route.ts
import { NextResponse } from "next/server";
import dbConnect from '@/lib/dbConnect';
import Contrato, { IContrato } from '@/models/Contrato';

export async function GET() {
  try {
    await dbConnect();

    // Busca un contrato (puedes ajustar la consulta según tus necesidades)
    const contrato = await Contrato.findOne().lean() as IContrato | null;
    if (!contrato) {
      console.error("No se encontró ningún contrato en la BD.");
      return NextResponse.json({ error: "No se encontró ningún contrato" }, { status: 404 });
    }
    const { ranchId } = contrato;
    if (!ranchId) {
      console.error("El contrato encontrado no tiene ranchId.");
      return NextResponse.json({ error: "El contrato no tiene ranchId" }, { status: 404 });
    }

    const token = process.env.IXORIGUE_TOKEN;
    const baseUrl = process.env.IXORIGUE_API_URL || "https://api.ixorigue.com";
    if (!token) {
      console.error("No se encontró el token de Ixorigue.");
      return NextResponse.json({ error: "No token set" }, { status: 500 });
    }

    // Construir la URL para la API de Ixorigue
    const url = `${baseUrl}/api/Ranches/`;
    console.log("Llamando a Ixorigue en:", url);

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Status de la respuesta de Ixorigue:", res.status);
    
    if (!res.ok) {
      const errBody = await res.text();
      console.error(`Ixorigue ranches error: ${res.status} - ${errBody}`);
      return NextResponse.json(
        { error: `Ixorigue ranches error: ${res.status} - ${errBody}` },
        { status: 500 }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error en /api/ranches:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
