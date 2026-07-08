import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useEffect } from 'react';
import api from '../../api/axios';
import type { Account, AccountType } from '../../types/account.types';

const ACCOUNT_TYPES: AccountType[] = ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'];

const schema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  type: z.enum(['Asset', 'Liability', 'Equity', 'Revenue', 'Expense']),
  is_active: z.boolean(),
  parent_id: z.number().nullable().optional(),
});

type FormData = z.infer<typeof schema>;

export default function AccountFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { is_active: true, parent_id: null },
  });

  const { data: accounts = [] } = useQuery<Account[]>({
    queryKey: ['accounts'],
    queryFn: () => api.get('/accounts').then((r) => r.data.data),
  });

  const { data: account } = useQuery<Account>({
    queryKey: ['accounts', id],
    queryFn: () => api.get(`/accounts/${id}`).then((r) => r.data.data),
    enabled: isEdit,
  });

  useEffect(() => {
    if (account) reset({ ...account, parent_id: account.parent_id ?? null });
  }, [account, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      isEdit ? api.put(`/accounts/${id}`, data) : api.post('/accounts', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['accounts'] });
      toast.success(isEdit ? 'Akun diperbarui' : 'Akun ditambahkan');
      navigate('/accounts');
    },
    onError: () => toast.error('Gagal menyimpan akun'),
  });

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? 'Edit Akun' : 'Tambah Akun'}</h1>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Akun</label>
            <input {...register('name')} className="w-full border rounded-lg px-3 py-2 text-sm" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipe</label>
            <select {...register('type')} className="w-full border rounded-lg px-3 py-2 text-sm">
              {ACCOUNT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Akun Induk (Opsional)</label>
            <select
              {...register('parent_id', { setValueAs: (v) => v === '' ? null : Number(v) })}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">-- Tidak ada --</option>
              {accounts
                .filter((a) => !isEdit || a.id !== Number(id))
                .map((a) => (
                  <option key={a.id} value={a.id}>{a.code} - {a.name}</option>
                ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_active" {...register('is_active')} className="rounded" />
            <label htmlFor="is_active" className="text-sm text-gray-700">Aktif</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button type="button" onClick={() => navigate('/accounts')} className="border px-6 py-2 rounded-lg text-sm">
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
