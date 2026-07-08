import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import api from '../../api/axiosClient';
import type { Transaction } from '../../types/transaction.types';
import type { Account } from '../../types/account.types';
import { Plus } from 'lucide-react';

export default function TransactionListPage() {
  const [filters, setFilters] = useState({ transaction_date: '', account: '' });

  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ['transactions', filters],
    queryFn: () =>
      api.get('/transactions', {
        params: Object.fromEntries(
          Object.entries(filters).filter(([, v]) => v !== '')
        ),
      }).then((r) => r.data.data),
  });

  const { data: accounts = [] } = useQuery<Account[]>({
    queryKey: ['accounts'],
    queryFn: () => api.get('/accounts').then((r) => r.data.data),
  });

  const formatIDR = (val: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Riwayat Transaksi</h1>
        <Link
          to="/transactions/create"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          <Plus size={16} /> Tambah Transaksi
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 flex gap-4 flex-wrap">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Tanggal</label>
          <input
            type="date"
            value={filters.transaction_date}
            onChange={(e) => setFilters((f) => ({ ...f, transaction_date: e.target.value }))}
            className="border rounded-lg px-3 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Nama Akun</label>
          <select
            value={filters.account}
            onChange={(e) => setFilters((f) => ({ ...f, account: e.target.value }))}
            className="border rounded-lg px-3 py-1.5 text-sm"
          >
            <option value="">Semua Akun</option>
            {accounts.map((a) => <option key={a.id} value={a.name}>{a.code} - {a.name}</option>)}
          </select>
        </div>
        <button
          onClick={() => setFilters({ transaction_date: '', account: '' })}
          className="mt-5 text-sm text-gray-500 hover:text-gray-700"
        >
          Reset
        </button>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Memuat...</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Tanggal</th>
                <th className="px-6 py-3 text-left">Deskripsi</th>
                <th className="px-6 py-3 text-left">Akun</th>
                <th className="px-6 py-3 text-left">Tipe</th>
                <th className="px-6 py-3 text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{trx.transaction_date}</td>
                  <td className="px-6 py-4">{trx.description}</td>
                  <td className="px-6 py-4">{trx.account?.name ?? '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      trx.entry_type === 'debit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {trx.entry_type === 'debit' ? 'Debit' : 'Kredit'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">{formatIDR(trx.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
