import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Dashboard Financeiro",
  description: "Controle financeiro pessoal",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="flex h-screen bg-gray-50 text-slate-900">
        
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 shadow-lg p-4 flex flex-col">
          <h1 className="text-2xl font-bold mb-6 text-slate-200">💰 Dashboard</h1>
          <nav className="flex flex-col gap-4">
            <a href="/" className="hover:text-green-400 text-slate-200">Dashboard</a>
            <a href="/transactions" className="hover:text-green-400 text-slate-200">Transações</a>
            <a href="/transactions/manage" className="hover:text-green-400 text-slate-200">Relatórios</a>
            <a href="/settings" className="hover:text-green-400 text-slate-200">Configurações</a>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white shadow p-4 flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-800">Guilherme!</span>
            <button className="px-3 py-1 bg-green-400 text-white rounded-md hover:bg-green-500">Sair</button>
          </header>

          {/* Content */}
          <section className="p-6 flex-1 overflow-y-auto">
            {children}
          </section>
        </main>
        
      </body>
    </html>
  );
}