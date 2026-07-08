import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../../api/axios';
import type { Account } from '../../types/account.types';
import { Plus, Pencil, Trash2 } from 'lucide-react';

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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Daftar Akun</h1>
        <Link
          to="/accounts/create"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          <Plus size={16} /> Tambah Akun
        </Link>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Memuat...</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Kode</th>
                <th className="px-6 py-3 text-left">Nama</th>
                <th className="px-6 py-3 text-left">Tipe</th>
                <th className="px-6 py-3 text-left">Parent</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {accounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono">{acc.code}</td>
                  <td className="px-6 py-4 font-medium">{acc.name}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">{acc.type}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{acc.parent?.name ?? '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      acc.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {acc.is_active ? 'Aktif' : 'Non-aktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link to={`/accounts/${acc.id}/edit`} className="text-blue-600 hover:text-blue-800">
                        <Pencil size={16} />
                      </Link>
                      <button onClick={() => handleDelete(acc.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
