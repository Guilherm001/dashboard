import React from "react";
import GraficoLinha from "@/components/grafico/index";
import Card from "@/components/cards/index";

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4 bg-gray-200 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Visão Geral</h2>

    
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card />
        <Card />
        <Card />
      </div>
      <GraficoLinha />

      

    </div>
  );
}
