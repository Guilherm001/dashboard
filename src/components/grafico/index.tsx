'use client';
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const OptionsChartLine = {
  chart: { id: "basic-line" },
  xaxis: { categories: [1,2,3,4,5,6,7,8,9,10] }
};

const SeriesChartLine = [
  {
    name: "Entrada",

    data: [23, 60, 30, 70, 40, 80, 53, 75, 88, 100]
  },
  {
    name: "Gastos",
    
    data: [20, 45, 26, 60, 20, 30, 48, 48, 62, 80]
  }
];

export default function GraficoLinha() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gráfico de Linha</h2>
      <Chart
        options={OptionsChartLine}
        series={SeriesChartLine}
        type="line"
        width="100%"
        height={350}
      />
    </div>
  );
}