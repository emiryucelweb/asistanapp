import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/shared/stores/auth-store';
import { loginSchema, type LoginFormData } from '@/shared/lib/validation/schemas/auth.schema';
import { FormField, CheckboxField } from '@/shared/components/forms/FormField';
import { ButtonLoader } from '@/shared/ui/loading';
import { Mail, Lock } from 'lucide-react';
import { logger } from '@/shared/utils/logger';

const LoginPage: React.FC = () => {
  const { t } = useTranslation('common');
  const { login, isLoading, error } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch (err) {
      logger.error('Login failed', err as Error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-auto flex items-center justify-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">AsistanApp</h2>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Hesabınıza giriş yapın
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Giriş yaparak sisteme erişebilirsiniz
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4">
              <div className="text-sm text-red-700 dark:text-red-400">{error}</div>
            </div>
          )}
          
          <div className="space-y-4">
            <FormField
              label={t('auth.email')}
              name="email"
              type="email"
              register={register}
              error={errors.email}
              icon={<Mail className="w-5 h-5" />}
              placeholder={t('auth.emailPlaceholder')}
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
              placeholder={t('auth.passwordPlaceholder')}
              autoComplete="current-password"
              showPasswordToggle
              disabled={isLoading || isSubmitting}
            />
          </div>

          <div className="flex items-center justify-between">
            <CheckboxField
              label={t('auth.rememberMe')}
              name="rememberMe"
              register={register}
              error={errors.rememberMe}
            />

            <div className="text-sm">
              <Link
                to="/auth/forgot-password"
                className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
              >
                {t('auth.forgotPassword')}
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="group relative w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {(isLoading || isSubmitting) && <ButtonLoader />}
              <span>{t('auth.login')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
