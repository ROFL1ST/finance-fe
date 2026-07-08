import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useMemo } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import api from '../../api/axios';
import type { Account } from '../../types/account.types';
import DataTable from '../../components/shared/DataTable';
import { Plus, Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react';

const TYPE_BADGE: Record<string, string> = {
  Asset:     'bg-blue-100 text-blue-700',
  Liability: 'bg-red-100 text-red-700',
  Equity:    'bg-purple-100 text-purple-700',
  Revenue:   'bg-green-100 text-green-700',
  Expense:   'bg-orange-100 text-orange-700',
};

export default function AccountListPage() {
  const qc = useQueryClient();

  const { data: accounts = [], isLoading } = useQuery<Account[]>({
    queryKey: ['accounts'],
    queryFn: () => api.get('/accounts').then((r) => r.data.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/accounts/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['accounts'] });
      toast.success('Akun berhasil dihapus');
    },
    onError: () => toast.error('Gagal menghapus akun'),
  });

  const handleDelete = (id: number) => {
    if (confirm('Hapus akun ini?')) deleteMutation.mutate(id);
  };

  const columns = useMemo<ColumnDef<Account, any>[]>(() => [
    {
      accessorKey: 'code',
      header: 'Kode',
      size: 120,
      cell: ({ getValue }) => (
        <span className="font-mono text-gray-700">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Nama Akun',
      cell: ({ getValue }) => (
        <span className="font-medium text-gray-800">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Tipe',
      size: 130,
      cell: ({ getValue }) => {
        const type = getValue<string>();
        return (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_BADGE[type] ?? 'bg-gray-100 text-gray-600'}`}>
            {type}
          </span>
        );
      },
    },
    {
      id: 'parent',
      header: 'Akun Induk',
      size: 160,
      accessorFn: (row) => row.parent?.name ?? '-',
      cell: ({ getValue }) => (
        <span className="text-gray-500">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      size: 100,
      cell: ({ getValue }) => {
        const active = getValue<boolean>();
        return active ? (
          <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
            <CheckCircle size={14} /> Aktif
          </span>
        ) : (
          <span className="flex items-center gap-1 text-gray-400 text-xs font-medium">
            <XCircle size={14} /> Non-aktif
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Aksi',
      size: 80,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Link
            to={`/accounts/${row.original.id}/edit`}
            className="text-blue-500 hover:text-blue-700 transition-colors"
            title="Edit"
          >
            <Pencil size={16} />
          </Link>
          <button
            onClick={() => handleDelete(row.original.id)}
            className="text-red-400 hover:text-red-600 transition-colors"
            title="Hapus"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ], [deleteMutation]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Daftar Akun</h1>
          <p className="text-sm text-gray-500 mt-1">{accounts.length} akun terdaftar</p>
        </div>
        <Link
          to="/accounts/create"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} /> Tambah Akun
        </Link>
      </div>

      <DataTable
        data={accounts}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="Belum ada akun. Tambah akun pertama kamu!"
      />
    </div>
  );
}
