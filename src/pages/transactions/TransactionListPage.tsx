import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import api from '../../api/axios';
import type { Transaction } from '../../types/transaction.types';
import type { Account } from '../../types/account.types';
import DataTable from '../../components/shared/DataTable';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react';

const formatIDR = (val: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

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

  const columns = useMemo<ColumnDef<Transaction, any>[]>(() => [
    {
      accessorKey: 'transaction_date',
      header: 'Tanggal',
      size: 120,
      cell: ({ getValue }) => (
        <span className="text-gray-600">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Deskripsi',
      cell: ({ getValue }) => (
        <span className="font-medium text-gray-800">{getValue<string>()}</span>
      ),
    },
    {
      id: 'account',
      header: 'Akun',
      accessorFn: (row) => row.account?.name ?? '-',
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-gray-800">{row.original.account?.name ?? '-'}</p>
          <p className="text-xs text-gray-400">{row.original.account?.code}</p>
        </div>
      ),
    },
    {
      accessorKey: 'entry_type',
      header: 'Tipe',
      size: 110,
      cell: ({ getValue }) => {
        const type = getValue<string>();
        return type === 'debit' ? (
          <span className="flex items-center gap-1.5 text-green-700 bg-green-50 px-2.5 py-1 rounded-full text-xs font-medium w-fit">
            <TrendingUp size={13} /> Debit
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-red-700 bg-red-50 px-2.5 py-1 rounded-full text-xs font-medium w-fit">
            <TrendingDown size={13} /> Kredit
          </span>
        );
      },
    },
    {
      accessorKey: 'amount',
      header: 'Jumlah',
      size: 160,
      cell: ({ getValue, row }) => {
        const type = row.original.entry_type;
        return (
          <span className={`font-semibold ${
            type === 'debit' ? 'text-green-700' : 'text-red-600'
          }`}>
            {type === 'credit' ? '-' : '+'}{formatIDR(getValue<number>())}
          </span>
        );
      },
    },
  ], []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Riwayat Transaksi</h1>
          <p className="text-sm text-gray-500 mt-1">{transactions.length} transaksi ditemukan</p>
        </div>
        <Link
          to="/transactions/create"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} /> Tambah Transaksi
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 flex gap-4 flex-wrap items-end">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Tanggal</label>
          <input
            type="date"
            value={filters.transaction_date}
            onChange={(e) => setFilters((f) => ({ ...f, transaction_date: e.target.value }))}
            className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Akun</label>
          <select
            value={filters.account}
            onChange={(e) => setFilters((f) => ({ ...f, account: e.target.value }))}
            className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Semua Akun</option>
            {accounts.map((a) => <option key={a.id} value={a.name}>{a.code} - {a.name}</option>)}
          </select>
        </div>
        {(filters.transaction_date || filters.account) && (
          <button
            onClick={() => setFilters({ transaction_date: '', account: '' })}
            className="text-sm text-red-500 hover:text-red-700 pb-0.5"
          >
            Reset Filter
          </button>
        )}
      </div>

      <DataTable
        data={transactions}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="Belum ada transaksi yang cocok dengan filter."
      />
    </div>
  );
}
