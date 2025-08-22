'use client';
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const OptionsChartLine = {
  chart: { id: "basic-line" },
  xaxis: { categories: [1,2,3,4,5,6,7,8,9,10] }
};

const SeriesChartLine = [
  {
    name: "Primeiro",
    data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
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