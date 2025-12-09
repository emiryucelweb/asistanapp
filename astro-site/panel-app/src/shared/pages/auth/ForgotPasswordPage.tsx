import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/shared/lib/validation/schemas/auth.schema';
import { FormField } from '@/shared/components/forms/FormField';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { logger } from '@/shared/utils/logger';

const ForgotPasswordPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

   
  // Note: react-hook-form's watch() is intentionally used this way (standard pattern)
  const email = watch('email');

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      // TODO: API call to send reset password email
      logger.info('Password reset requested', { email: data.email });
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setIsSubmitted(true);
    } catch (err) {
      logger.error('Password reset failed', err as Error);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
              E-posta Gönderildi
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Şifre sıfırlama bağlantısı <strong>{email}</strong> adresine gönderildi.
              Lütfen e-postanızı kontrol edin.
            </p>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-md p-4">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              💡 E-postayı görmüyorsanız spam klasörünü kontrol edin.
            </p>
          </div>

          <div className="text-center">
            <Link
              to="/auth/login"
              className="inline-flex items-center gap-2 font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Giriş sayfasına dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-auto flex items-center justify-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">AsistanApp</h2>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Şifre Sıfırlama
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <FormField
            label="E-posta adresi"
            name="email"
            type="email"
            register={register}
            error={errors.email}
            icon={<Mail className="w-5 h-5" />}
            placeholder="E-posta adresinizi girin"
            autoComplete="email"
            disabled={isSubmitting}
          />

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
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
                  <span>Gönderiliyor...</span>
                </div>
              ) : (
                'Sıfırlama Bağlantısı Gönder'
              )}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/auth/login"
              className="inline-flex items-center gap-2 font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Giriş sayfasına dön
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
