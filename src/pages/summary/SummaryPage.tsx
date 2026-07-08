import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import type { Account } from '../../types/account.types';

const TYPE_COLORS: Record<string, string> = {
  Asset: 'bg-blue-50 border-blue-200 text-blue-800',
  Liability: 'bg-red-50 border-red-200 text-red-800',
  Equity: 'bg-purple-50 border-purple-200 text-purple-800',
  Revenue: 'bg-green-50 border-green-200 text-green-800',
  Expense: 'bg-orange-50 border-orange-200 text-orange-800',
};

export default function SummaryPage() {
  const { data: accounts = [], isLoading } = useQuery<Account[]>({
    queryKey: ['accounts-summary'],
    queryFn: () => api.get('/accounts/summary').then((r) => r.data.data),
  });

  const groupedByType = accounts.reduce((acc, account) => {
    if (!acc[account.type]) acc[account.type] = [];
    acc[account.type].push(account);
    return acc;
  }, {} as Record<string, Account[]>);

  const formatIDR = (val: number = 0) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Ringkasan Keuangan</h1>
      {isLoading ? (
        <p className="text-gray-500">Memuat...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Object.entries(groupedByType).map(([type, accs]) => (
            <div key={type} className={`border rounded-2xl p-5 ${TYPE_COLORS[type] ?? 'bg-gray-50'}`}>
              <h2 className="text-sm font-semibold uppercase tracking-wide mb-3">{type}</h2>
              <div className="space-y-2">
                {accs.map((a) => (
                  <div key={a.id} className="flex justify-between text-sm">
                    <span className="truncate">{a.code} {a.name}</span>
                    <span className="font-medium ml-2 shrink-0">{formatIDR(a.balance)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-3 pt-3 flex justify-between text-sm font-bold">
                <span>Total</span>
                <span>{formatIDR(accs.reduce((s, a) => s + (a.balance ?? 0), 0))}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
