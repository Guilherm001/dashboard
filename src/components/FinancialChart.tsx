// components/FinancialChart.tsx
"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface FinancialChartProps {
  data: {
    label: string;
    income: number;
    expenses: number;
  }[];
  period: string;
}

export default function FinancialChart({ data, period }: FinancialChartProps) {
  const chartData = data.map(item => ({
    name: item.label,
    Entradas: item.income,
    Saídas: item.expenses
  }));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            formatter={(value) => [
              new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(Number(value)),
              ''
            ]}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="Entradas" 
            stroke="#10b981" 
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="Saídas" 
            stroke="#ef4444" 
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}