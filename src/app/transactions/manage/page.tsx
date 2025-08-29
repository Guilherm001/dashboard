// app/transactions/manage/page.tsx
"use client";

import { useState, useEffect } from "react";

interface Transaction {
  id?: number;
  description: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
  type: "income" | "expense";
}

export default function ManageTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Transaction>({
    description: "",
    amount: 0,
    type: "expense",
    date: new Date().toISOString().split('T')[0],
    categoryId: 0
  });

  // Carregar transações e categorias
  useEffect(() => {
    loadTransactions();
    loadCategories();
  }, []);

  const loadTransactions = async () => {
    const response = await fetch("/api/transactions");
    const data = await response.json();
    setTransactions(data);
  };

  const loadCategories = async () => {
    const response = await fetch("/api/categories");
    const data = await response.json();
    setCategories(data);
    if (data.length > 0) {
      setFormData(prev => ({ ...prev, categoryId: data[0].id }));
    }
  };

  // Manipular mudanças no formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value
    }));
  };

  // Criar ou atualizar transação
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const url = editingTransaction 
      ? `/api/transactions/${editingTransaction.id}`
      : "/api/transactions";
    
    const method = editingTransaction ? "PUT" : "POST";
    
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setIsModalOpen(false);
      setEditingTransaction(null);
      setFormData({
        description: "",
        amount: 0,
        type: "expense",
        date: new Date().toISOString().split('T')[0],
        categoryId: categories[0]?.id || 0
      });
      loadTransactions();
    }
  };

  // Editar transação
  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      date: transaction.date.split('T')[0],
      categoryId: transaction.categoryId
    });
    setIsModalOpen(true);
  };

  // Excluir transação
  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta transação?")) {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        loadTransactions();
      }
    }
  };

  // Filtros
  const filteredCategories = categories.filter(cat => cat.type === formData.type);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Transações</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Nova Transação
        </button>
      </div>

      {/* Lista de Transações */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Data</th>
              <th className="px-6 py-3 text-left">Descrição</th>
              <th className="px-6 py-3 text-left">Categoria</th>
              <th className="px-6 py-3 text-left">Tipo</th>
              <th className="px-6 py-3 text-left">Valor</th>
              <th className="px-6 py-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{new Date(transaction.date).toLocaleDateString('pt-BR')}</td>
                <td className="px-6 py-4">{transaction.description}</td>
                <td className="px-6 py-4">
                  {categories.find(cat => cat.id === transaction.categoryId)?.name}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    transaction.type === "income" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {transaction.type === "income" ? "Receita" : "Despesa"}
                  </span>
                </td>
                <td className={`px-6 py-4 font-medium ${
                  transaction.type === "income" ? "text-green-600" : "text-red-600"
                }`}>
                  R$ {transaction.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => handleEdit(transaction)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(transaction.id!)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {editingTransaction ? "Editar" : "Nova"} Transação
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Descrição</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Valor</label>
                <input
                  type="number"
                  step="0.01"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Tipo</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="expense">Despesa</option>
                  <option value="income">Receita</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Categoria</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded"
                >
                  {filteredCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Data</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="flex space-x-2 pt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {editingTransaction ? "Atualizar" : "Criar"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingTransaction(null);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}