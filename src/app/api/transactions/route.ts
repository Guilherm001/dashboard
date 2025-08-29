// app/api/transactions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Interface para os parâmetros de filtro
interface TransactionFilters {
  type?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

// GET - Buscar transações (com filtros)
export async function GET(request: NextRequest) {
  try {
    // Extrair parâmetros de consulta da URL
    const { searchParams } = new URL(request.url);
    
    // Construir objeto de filtros
    const filters: TransactionFilters = {};
    
    if (searchParams.has('type')) {
      filters.type = searchParams.get('type') as string;
    }
    
    if (searchParams.has('category')) {
      filters.category = searchParams.get('category') as string;
    }
    
    if (searchParams.has('startDate')) {
      filters.startDate = searchParams.get('startDate') as string;
    }
    
    if (searchParams.has('endDate')) {
      filters.endDate = searchParams.get('endDate') as string;
    }
    
    if (searchParams.has('minAmount')) {
      filters.minAmount = parseFloat(searchParams.get('minAmount') as string);
    }
    
    if (searchParams.has('maxAmount')) {
      filters.maxAmount = parseFloat(searchParams.get('maxAmount') as string);
    }
    
    // Construir objeto where para o Prisma
    const where: any = {};
    
    if (filters.type) {
      where.type = filters.type;
    }
    
    if (filters.category) {
      where.category = {
        name: filters.category
      };
    }
    
    if (filters.startDate || filters.endDate) {
      where.date = {};
      
      if (filters.startDate) {
        where.date.gte = new Date(filters.startDate);
      }
      
      if (filters.endDate) {
        where.date.lte = new Date(filters.endDate);
      }
    }
    
    if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
      where.amount = {};
      
      if (filters.minAmount !== undefined) {
        where.amount.gte = filters.minAmount;
      }
      
      if (filters.maxAmount !== undefined) {
        where.amount.lte = filters.maxAmount;
      }
    }
    
    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        category: true
      }
    });
    
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

// POST - Criar nova transação
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validação básica
    if (!body.description || !body.amount || !body.type || !body.date || !body.categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        description: body.description,
        amount: parseFloat(body.amount),
        type: body.type,
        date: new Date(body.date),
        categoryId: parseInt(body.categoryId),
        userId: 5 // ← ATENÇÃO: Você precisa ajustar isso!
      },
      include: {
        category: true
      }
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar transação (precisa ser na rota dinâmica [id])
// Isso fica em app/api/transactions/[id]/route.ts