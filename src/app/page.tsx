// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import FinancialChart from '@/components/FinancialChart';
import Card from '@/components/cards/index';

interface DashboardData {
  summary: {
    income: number;
    expenses: number;
    balance: number;
  };
  chartData: {
    label: string;
    income: number;
    expenses: number;
  }[];
  period: string;
  dateRange: {
    start: string;
    end: string;
  };
}

// Componente Card individual
function Card({ title, value, type }: { title: string; value: number; type: 'income' | 'expense' | 'balance' }) {
  const colors = {
    income: 'text-green-600',
    expense: 'text-red-600',
    balance: 'text-blue-600'
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(val);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-gray-300">
      <h3 className="text-lg font-semibold text-gray-600 mb-2">{title}</h3>
      <p className={`text-3xl font-bold ${colors[type]}`}>
        {formatCurrency(value)}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'month' | 'year'>('month');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        period: selectedPeriod,
        date: selectedDate
      });

      const response = await fetch(`/api/dashboard?${params}`);
      const dashboardData = await response.json();
      setData(dashboardData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod, selectedDate]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">Carregando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-gray-100 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Visão Geral</h2>

      {/* Filtros */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value as 'day' | 'month' | 'year')}
          className="px-4 py-2 border rounded-lg bg-white"
        >
          <option value="day">Dia</option>
          <option value="month">Mês</option>
          <option value="year">Ano</option>
        </select>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 border rounded-lg bg-white"
        />

        <button
          onClick={loadDashboardData}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Atualizar
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
  <Card 
    title="Entradas" 
    value={data?.summary.income || 0} 
    type="income" 
  />
  <Card 
    title="Saídas" 
    value={data?.summary.expenses || 0} 
    type="expense" 
  />
  <Card 
    title="Saldo" 
    value={data?.summary.balance || 0} 
    type="balance" 
  />
</div>

      {/* Gráfico */}
      {data && data.chartData && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Evolução Financeira</h3>
          <FinancialChart data={data.chartData} period={data.period} />
        </div>
      )}

      {/* Informações do período */}
      {data && (
        <div className="mt-4 text-sm text-gray-600">
          Período: {new Date(data.dateRange.start).toLocaleDateString('pt-BR')} 
          {' até '}
          {new Date(data.dateRange.end).toLocaleDateString('pt-BR')}
        </div>
      )}
    </div>
  );
}