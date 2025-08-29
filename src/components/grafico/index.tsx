// app/page.tsx
"use client";

import { useState, useEffect } from "react";

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

export default function Dashboard() {
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header com Filtros */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard Financeiro</h1>
        
        <div className="flex flex-wrap gap-4 items-center">
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
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card de Entradas */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Entradas</h3>
          <p className="text-3xl font-bold text-green-600">
            {data ? formatCurrency(data.summary.income) : 'R$ 0,00'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Período selecionado
          </p>
        </div>

        {/* Card de Saídas */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Saídas</h3>
          <p className="text-3xl font-bold text-red-600">
            {data ? formatCurrency(data.summary.expenses) : 'R$ 0,00'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Período selecionado
          </p>
        </div>

        {/* Card de Saldo */}
        <div className={`bg-white p-6 rounded-xl shadow-lg border-l-4 ${
          data && data.summary.balance >= 0 ? 'border-blue-500' : 'border-orange-500'
        }`}>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Saldo</h3>
          <p className={`text-3xl font-bold ${
            data && data.summary.balance >= 0 ? 'text-blue-600' : 'text-orange-600'
          }`}>
            {data ? formatCurrency(data.summary.balance) : 'R$ 0,00'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {data && data.summary.balance >= 0 ? 'Positivo' : 'Negativo'}
          </p>
        </div>
      </div>

      {/* Gráfico */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Evolução Financeira</h2>
        
        {data && data.chartData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tabela de dados */}
            <div>
              <h3 className="font-semibold mb-2">Detalhamento</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="text-left">{selectedPeriod === 'day' ? 'Hora' : selectedPeriod === 'month' ? 'Dia' : 'Mês'}</th>
                      <th className="text-right">Entradas</th>
                      <th className="text-right">Saídas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.chartData.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{item.label}</td>
                        <td className="text-right text-green-600">
                          {formatCurrency(item.income)}
                        </td>
                        <td className="text-right text-red-600">
                          {formatCurrency(item.expenses)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Gráfico simples com barras */}
            <div>
              <h3 className="font-semibold mb-2">Visualização</h3>
              <div className="space-y-2">
                {data.chartData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="w-16 text-sm">{item.label}</span>
                    <div className="flex-1 flex space-x-1">
                      <div
                        className="bg-green-400 rounded-l"
                        style={{ width: `${(item.income / Math.max(...data.chartData.map(d => d.income)) * 100) || 0}%`, height: '20px' }}
                      />
                      <div
                        className="bg-red-400 rounded-r"
                        style={{ width: `${(item.expenses / Math.max(...data.chartData.map(d => d.expenses)) * 100) || 0}%`, height: '20px' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Nenhum dado disponível para o período selecionado
          </div>
        )}
      </div>

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