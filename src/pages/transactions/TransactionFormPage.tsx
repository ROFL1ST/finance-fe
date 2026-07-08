import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '../../api/axios';
import type { Account } from '../../types/account.types';

const schema = z.object({
  transaction_date: z.string().min(1, 'Tanggal wajib diisi'),
  description: z.string().min(1, 'Deskripsi wajib diisi'),
  account_id: z.number({ required_error: 'Pilih akun' }).min(1, 'Pilih akun'),
  entry_type: z.enum(['debit', 'credit']), // BE column: entry_type
  amount: z.number({ required_error: 'Jumlah wajib diisi' }).positive('Jumlah harus > 0'),
});

type FormData = z.infer<typeof schema>;

export default function TransactionFormPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      transaction_date: new Date().toISOString().split('T')[0],
      entry_type: 'debit',
    },
  });

  const { data: accounts = [] } = useQuery<Account[]>({
    queryKey: ['accounts'],
    queryFn: () => api.get('/accounts').then((r) => r.data.data),
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => api.post('/transactions', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transaksi berhasil dicatat');
      navigate('/transactions');
    },
    onError: () => toast.error('Gagal mencatat transaksi'),
  });

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tambah Transaksi</h1>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
            <input
              type="date"
              {...register('transaction_date')}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
            {errors.transaction_date && <p className="text-red-500 text-xs mt-1">{errors.transaction_date.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <input
              {...register('description')}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="Pembelian ATK..."
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Akun</label>
            <select
              {...register('account_id', { valueAsNumber: true })}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value={0}>-- Pilih Akun --</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>{a.code} - {a.name}</option>
              ))}
            </select>
            {errors.account_id && <p className="text-red-500 text-xs mt-1">{errors.account_id.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Entri</label>
            <select {...register('entry_type')} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="debit">Debit</option>
              <option value="credit">Kredit</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah (Rp)</label>
            <input
              type="number"
              {...register('amount', { valueAsNumber: true })}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="0"
              min={1}
            />
            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/transactions')}
              className="border px-6 py-2 rounded-lg text-sm"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
