// components/Card.tsx
interface CardProps {
  title: string;
  value: number;
  type: 'income' | 'expense' | 'balance';
}

export default function Card({ title, value, type }: CardProps) {
  const colors = {
    income: 'text-green-600 border-green-500',
    expense: 'text-red-600 border-red-500',
    balance: 'text-blue-600 border-blue-500'
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(val);
  };

  return (
    <div className={`bg-white p-6 rounded-xl shadow-lg border-l-4 ${colors[type]}`}>
      <h3 className="text-lg font-semibold text-gray-600 mb-2">{title}</h3>
      <p className={`text-3xl font-bold ${colors[type]}`}>
        {formatCurrency(value)}
      </p>
    </div>
  );
}