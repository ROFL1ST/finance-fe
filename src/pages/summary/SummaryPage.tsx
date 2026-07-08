import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';

interface SummaryItem {
  account_id: number;
  account_name: string;
  account_code: string;
  account_type: string;
  total_debit: number;
  total_credit: number;
  balance: number;
}

const TYPE_COLORS: Record<string, string> = {
  Asset: 'bg-blue-50 border-blue-200 text-blue-800',
  Liability: 'bg-red-50 border-red-200 text-red-800',
  Equity: 'bg-purple-50 border-purple-200 text-purple-800',
  Revenue: 'bg-green-50 border-green-200 text-green-800',
  Expense: 'bg-orange-50 border-orange-200 text-orange-800',
};

export default function SummaryPage() {
  // BE: GET /summary (not /accounts/summary)
  const { data: summary = [], isLoading } = useQuery<SummaryItem[]>({
    queryKey: ['summary'],
    queryFn: () => api.get('/summary').then((r) => r.data.data),
  });

  const groupedByType = summary.reduce((acc, item) => {
    if (!acc[item.account_type]) acc[item.account_type] = [];
    acc[item.account_type].push(item);
    return acc;
  }, {} as Record<string, SummaryItem[]>);

  const formatIDR = (val: number = 0) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Ringkasan Keuangan</h1>
      {isLoading ? (
        <p className="text-gray-500">Memuat...</p>
      ) : summary.length === 0 ? (
        <p className="text-gray-400 text-sm">Belum ada data transaksi.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Object.entries(groupedByType).map(([type, items]) => (
            <div key={type} className={`border rounded-2xl p-5 ${TYPE_COLORS[type] ?? 'bg-gray-50'}`}>
              <h2 className="text-sm font-semibold uppercase tracking-wide mb-3">{type}</h2>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.account_id} className="flex justify-between text-sm">
                    <span className="truncate">{item.account_code} {item.account_name}</span>
                    <span className="font-medium ml-2 shrink-0">{formatIDR(item.balance)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-3 pt-3 flex justify-between text-sm font-bold">
                <span>Total</span>
                <span>{formatIDR(items.reduce((s, i) => s + i.balance, 0))}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
