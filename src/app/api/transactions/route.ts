import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// GET /api/transactions
export async function GET() {
  try {
    const transactions = await PrismaClient.transactions.findMany(); 
    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
