import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import api from '../../api/axios';
import type { Transaction } from '../../types/transaction.types';
import type { Account } from '../../types/account.types';
import { Plus } from 'lucide-react';

export default function TransactionListPage() {
  const [filters, setFilters] = useState({ date_from: '', date_to: '', account_id: '' });

  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ['transactions', filters],
    queryFn: () =>
      api.get('/transactions', { params: filters }).then((r) => r.data.data),
  });

  const { data: accounts = [] } = useQuery<Account[]>({
    queryKey: ['accounts'],
    queryFn: () => api.get('/accounts').then((r) => r.data.data),
  });

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
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 flex gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Dari Tanggal</label>
          <input type="date" value={filters.date_from} onChange={(e) => setFilters((f) => ({ ...f, date_from: e.target.value }))} className="border rounded-lg px-3 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Sampai Tanggal</label>
          <input type="date" value={filters.date_to} onChange={(e) => setFilters((f) => ({ ...f, date_to: e.target.value }))} className="border rounded-lg px-3 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Akun</label>
          <select value={filters.account_id} onChange={(e) => setFilters((f) => ({ ...f, account_id: e.target.value }))} className="border rounded-lg px-3 py-1.5 text-sm">
            <option value="">Semua Akun</option>
            {accounts.map((a) => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}
          </select>
        </div>
        <button onClick={() => setFilters({ date_from: '', date_to: '', account_id: '' })} className="mt-5 text-sm text-gray-500 hover:text-gray-700">Reset</button>
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
                <th className="px-6 py-3 text-left">Akun (Debit)</th>
                <th className="px-6 py-3 text-left">Akun (Kredit)</th>
                <th className="px-6 py-3 text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((trx) => {
                const debit = trx.entries.find((e) => e.type === 'debit');
                const credit = trx.entries.find((e) => e.type === 'credit');
                return (
                  <tr key={trx.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{trx.date}</td>
                    <td className="px-6 py-4">{trx.description}</td>
                    <td className="px-6 py-4 text-green-700">{debit?.account?.name ?? '-'}</td>
                    <td className="px-6 py-4 text-red-600">{credit?.account?.name ?? '-'}</td>
                    <td className="px-6 py-4 text-right font-medium">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(debit?.amount ?? 0)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
