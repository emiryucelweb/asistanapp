/**
 * Super Admin Login Page - AsistanApp Yönetim Paneli Girişi
 */
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Shield, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/shared/stores/auth-store';
import { adminLoginSchema, type AdminLoginFormData } from '@/shared/lib/validation/schemas/auth.schema';
import { FormField, CheckboxField } from '@/shared/components/forms/FormField';
import { logger } from '@/shared/utils/logger';

const AdminLoginPage: React.FC = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: AdminLoginFormData) => {
    try {
      await login(data);
      navigate('/asistansuper/dashboard');
    } catch (err) {
      logger.error('Admin login failed', err as Error);
      setFormError('root', {
        type: 'manual',
        message: err instanceof Error ? err.message : t('auth.loginFailed'),
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDQyYzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnoiIHN0cm9rZT0iIzFhMjAzZSIgc3Ryb2tlLXdpZHRoPSIuNSIvPjwvZz48L3N2Zz4=')] opacity-20" />

      <div className="relative w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Super Admin Panel</h1>
          <p className="text-gray-400">{t('auth.adminLoginSubtitle')}</p>
        </div>

        {/* Login Form */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-8 shadow-2xl">
          {errors.root && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">{errors.root.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              label="E-posta Adresi"
              name="email"
              type="email"
              register={register}
              error={errors.email}
              icon={<Mail className="w-5 h-5" />}
              placeholder="admin@asistanapp.com"
              autoComplete="email"
              disabled={isLoading || isSubmitting}
            />

            <FormField
              label={t('auth.password')}
              name="password"
              type="password"
              register={register}
              error={errors.password}
              icon={<Lock className="w-5 h-5" />}
              placeholder="••••••••"
              autoComplete="current-password"
              showPasswordToggle
              disabled={isLoading || isSubmitting}
            />

            <CheckboxField
              label={t('auth.rememberMe')}
              name="rememberMe"
              register={register}
              error={errors.rememberMe}
            />

            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {(isLoading || isSubmitting) ? (
                <>
                  <div className="flex items-center justify-center gap-0.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1 h-1 rounded-full bg-white animate-bounce"
                        style={{
                          animationDelay: `${i * 0.15}s`,
                          animationDuration: '0.6s',
                        }}
                      />
                    ))}
                  </div>
                  <span>Giriş yapılıyor...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Yönetici Girişi</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/auth/forgot-password"
              className="text-sm text-blue-400 hover:underline"
            >
              Şifrenizi mi unuttunuz?
            </Link>
          </div>

          <div className="mt-4 pt-6 border-t border-slate-700 text-center">
            <p className="text-sm text-gray-400">
              Ekip üyesi misiniz?{' '}
              <Link to="/agent/login" className="text-blue-400 font-medium hover:underline">
                Ekip Girişi
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
