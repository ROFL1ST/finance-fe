import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../../api/axios';
import { useAuthStore } from '../../store/authStore';
import type { AuthResponse } from '../../types/auth.types';

const schema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  password_confirmation: z.string(),
}).refine((d) => d.password === d.password_confirmation, {
  message: 'Password tidak cocok',
  path: ['password_confirmation'],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.post<AuthResponse>('/register', data);
      // BE returns token and user inside `data` field
      setAuth(res.data.token, res.data.data);
      toast.success('Registrasi berhasil!');
      navigate('/');
    } catch {
      toast.error('Registrasi gagal. Coba lagi.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Register</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {(['name', 'email', 'password', 'password_confirmation'] as const).map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {field.replace('_', ' ')}
              </label>
              <input
                type={field.includes('password') ? 'password' : 'text'}
                {...register(field)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]?.message}</p>}
            </div>
          ))}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Loading...' : 'Register'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Sudah punya akun? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
