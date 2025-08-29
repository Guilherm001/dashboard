// app/transactions/page.tsx
"use client";

import { useEffect, useState } from "react";

type Transaction = {
  id: string;
  date: string;
  description: string;
  category: {
    id: string;
    name: string;
    type: string;
    color: string;
  };
  type: string;
  amount: number;
};

type Filters = {
  type: string;
  category: string;
  startDate: string;
  endDate: string;
  minAmount: string;
  maxAmount: string;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    type: "",
    category: "",
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: ""
  });
  const [showFilters, setShowFilters] = useState(false);

  // Função para buscar transações com filtros
  const fetchTransactions = async (filters: Filters) => {
    setLoading(true);
    
    // Construir query string com filtros
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });
    
    try {
      const response = await fetch(`/api/transactions?${params.toString()}`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Buscar transações quando os filtros mudarem
  useEffect(() => {
    fetchTransactions(filters);
  }, [filters]);

  // Manipulador de mudanças nos filtros
  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Limpar todos os filtros
  const clearFilters = () => {
    setFilters({
      type: "",
      category: "",
      startDate: "",
      endDate: "",
      minAmount: "",
      maxAmount: ""
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Transações</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
        </button>
      </div>

      {/* Painel de Filtros */}
      {showFilters && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Filtros</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro por Tipo */}
            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Todos</option>
                <option value="income">Receita</option>
                <option value="expense">Despesa</option>
              </select>
            </div>

            {/* Filtro por Categoria */}
            <div>
              <label className="block text-sm font-medium mb-1">Categoria</label>
              <input
                type="text"
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                placeholder="Filtrar por categoria"
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Filtro por Valor Mínimo */}
            <div>
              <label className="block text-sm font-medium mb-1">Valor Mínimo</label>
              <input
                type="number"
                value={filters.minAmount}
                onChange={(e) => handleFilterChange("minAmount", e.target.value)}
                placeholder="Valor mínimo"
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Filtro por Valor Máximo */}
            <div>
              <label className="block text-sm font-medium mb-1">Valor Máximo</label>
              <input
                type="number"
                value={filters.maxAmount}
                onChange={(e) => handleFilterChange("maxAmount", e.target.value)}
                placeholder="Valor máximo"
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Filtro por Data Inicial */}
            <div>
              <label className="block text-sm font-medium mb-1">Data Inicial</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Filtro por Data Final */}
            <div>
              <label className="block text-sm font-medium mb-1">Data Final</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={clearFilters}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      )}

      {/* Tabela de Transações */}
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Data</th>
              <th className="py-2 px-4 border-b">Descrição</th>
              <th className="py-2 px-4 border-b">Categoria</th>
              <th className="py-2 px-4 border-b">Tipo</th>
              <th className="py-2 px-4 border-b">Valor</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td className="py-2 px-4 border-b">{t.date}</td>
                <td className="py-2 px-4 border-b">{t.description}</td>
                <td className="py-2 px-4 border-b">{t.category.name}</td>
                <td className="py-2 px-4 border-b">{t.type === "income" ? "Receita" : "Despesa"}</td>
                <td className="py-2 px-4 border-b">R$ {t.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}