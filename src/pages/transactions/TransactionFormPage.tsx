import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '../../api/axios';
import type { Account } from '../../types/account.types';
import { Plus, Trash2 } from 'lucide-react';

const entrySchema = z.object({
  account_id: z.number({ required_error: 'Pilih akun' }),
  type: z.enum(['debit', 'credit']),
  amount: z.number().positive('Jumlah harus > 0'),
});

const schema = z.object({
  date: z.string().min(1, 'Tanggal wajib diisi'),
  description: z.string().min(1, 'Deskripsi wajib diisi'),
  entries: z.array(entrySchema).min(1, 'Minimal 1 entri'),
});

type FormData = z.infer<typeof schema>;

export default function TransactionFormPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      entries: [{ account_id: 0, type: 'debit', amount: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'entries' });

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
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tambah Transaksi</h1>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
              <input type="date" {...register('date')} className="w-full border rounded-lg px-3 py-2 text-sm" />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <input {...register('description')} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Pembelian ATK..." />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Entri Transaksi</label>
              <button type="button" onClick={() => append({ account_id: 0, type: 'debit', amount: 0 })} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800">
                <Plus size={14} /> Tambah Entri
              </button>
            </div>
            {fields.map((field, i) => (
              <div key={field.id} className="flex gap-2 mb-2 items-start">
                <select
                  {...register(`entries.${i}.account_id`, { setValueAs: Number })}
                  className="flex-1 border rounded-lg px-3 py-2 text-sm"
                >
                  <option value={0}>-- Pilih Akun --</option>
                  {accounts.map((a) => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}
                </select>
                <select {...register(`entries.${i}.type`)} className="border rounded-lg px-3 py-2 text-sm">
                  <option value="debit">Debit</option>
                  <option value="credit">Kredit</option>
                </select>
                <input
                  type="number"
                  {...register(`entries.${i}.amount`, { valueAsNumber: true })}
                  className="w-32 border rounded-lg px-3 py-2 text-sm"
                  placeholder="0"
                />
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(i)} className="text-red-500 hover:text-red-700 pt-2">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button type="button" onClick={() => navigate('/transactions')} className="border px-6 py-2 rounded-lg text-sm">Batal</button>
          </div>
        </form>
      </div>
    </div>
  );
}
