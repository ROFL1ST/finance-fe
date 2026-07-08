import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';

// Exact shape from SummaryService.php DB query
interface SummaryItem {
  id: number;
  code: string;         // accounts.code
  name: string;         // accounts.name
  account_type: string; // accounts.account_type
  balance: number | string; // DB raw SUM — can come as string, can be negative
}

const TYPE_COLORS: Record<string, string> = {
  Asset:     'bg-blue-50 border-blue-200 text-blue-800',
  Liability: 'bg-red-50 border-red-200 text-red-800',
  Equity:    'bg-purple-50 border-purple-200 text-purple-800',
  Revenue:   'bg-green-50 border-green-200 text-green-800',
  Expense:   'bg-orange-50 border-orange-200 text-orange-800',
};

const toNumber = (val: number | string | undefined | null): number => {
  const n = Number(val);
  return isNaN(n) ? 0 : n;
};

const formatIDR = (val: number | string | undefined | null): string => {
  const n = toNumber(val);
  const abs = Math.abs(n);
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(abs);
  // Prefix minus OUTSIDE currency symbol: -Rp1.000 instead of Rp-1.000
  return n < 0 ? `-${formatted}` : formatted;
};

export default function SummaryPage() {
  const { data: summary = [], isLoading } = useQuery<SummaryItem[]>({
    queryKey: ['summary'],
    queryFn: () => api.get('/summary').then((r) => r.data.data),
  });

  const groupedByType = summary.reduce((acc, item) => {
    const type = item.account_type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {} as Record<string, SummaryItem[]>);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Ringkasan Keuangan</h1>

      {isLoading ? (
        <p className="text-gray-500">Memuat...</p>
      ) : summary.length === 0 ? (
        <p className="text-gray-400 text-sm">Belum ada data transaksi.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Object.entries(groupedByType).map(([type, items]) => {
            const total = items.reduce((s, i) => s + toNumber(i.balance), 0);
            return (
              <div key={type} className={`border rounded-2xl p-5 ${TYPE_COLORS[type] ?? 'bg-gray-50 border-gray-200'}`}>
                <h2 className="text-sm font-semibold uppercase tracking-wide mb-3">{type}</h2>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="truncate">{item.code} {item.name}</span>
                      <span className={`font-medium ml-2 shrink-0 ${
                        toNumber(item.balance) < 0 ? 'text-red-600' : ''
                      }`}>
                        {formatIDR(item.balance)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-3 pt-3 flex justify-between text-sm font-bold">
                  <span>Total</span>
                  <span className={total < 0 ? 'text-red-600' : ''}>
                    {formatIDR(total)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
