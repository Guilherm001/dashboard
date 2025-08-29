// app/api/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface DashboardQuery {
  period?: 'day' | 'month' | 'year';
  specificDate?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') as 'day' | 'month' | 'year' || 'month';
    const specificDate = searchParams.get('date') || new Date().toISOString().split('T')[0];

    // Calcular datas baseadas no período
    const date = new Date(specificDate);
    let startDate: Date;
    let endDate: Date;

    if (period === 'day') {
      startDate = new Date(date.setHours(0, 0, 0, 0));
      endDate = new Date(date.setHours(23, 59, 59, 999));
    } else if (period === 'month') {
      startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
    } else { // year
      startDate = new Date(date.getFullYear(), 0, 1);
      endDate = new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
    }

    // Buscar transações no período
    const transactions = await prisma.transaction.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        category: true
      }
    });

    // Calcular totais
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    // Preparar dados para o gráfico
    let chartData: { label: string; income: number; expenses: number }[] = [];

    if (period === 'day') {
      // Agrupar por hora do dia
      chartData = Array.from({ length: 24 }, (_, i) => {
        const hour = i.toString().padStart(2, '0') + ':00';
        const hourTransactions = transactions.filter(t => 
          new Date(t.date).getHours() === i
        );
        
        return {
          label: hour,
          income: hourTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
          expenses: hourTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
        };
      });
    } else if (period === 'month') {
      // Agrupar por dia do mês
      const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      chartData = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const dayTransactions = transactions.filter(t => 
          new Date(t.date).getDate() === day
        );
        
        return {
          label: day.toString(),
          income: dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
          expenses: dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
        };
      });
    } else { // year
      // Agrupar por mês
      chartData = Array.from({ length: 12 }, (_, i) => {
        const month = i;
        const monthTransactions = transactions.filter(t => 
          new Date(t.date).getMonth() === month
        );
        
        return {
          label: new Date(2024, month, 1).toLocaleDateString('pt-BR', { month: 'short' }),
          income: monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
          expenses: monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
        };
      });
    }

    return NextResponse.json({
      summary: {
        income: totalIncome,
        expenses: totalExpenses,
        balance
      },
      chartData,
      period,
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}