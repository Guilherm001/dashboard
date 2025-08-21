"use client";

import { useEffect, useState } from "react";

type Transaction = {
  id: string;
  date: string;
  description: string;
  category: string;
  type: string;
  amount: number;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/transactions")
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Transações</h2>
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
                <td className="py-2 px-4 border-b">{t.category}</td>
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