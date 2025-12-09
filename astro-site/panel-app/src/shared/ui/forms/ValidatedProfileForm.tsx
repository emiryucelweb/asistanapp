/**
 * Validated Profile Form Example
 * Shows how to use Zod + React Hook Form
 */
import React from 'react';
import { logger } from '@/shared/utils/logger';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { profileSchema, type ProfileFormData } from '@/lib/validations/settings.schemas';
import { useTranslation } from 'react-i18next';

interface ValidatedProfileFormProps {
  initialData?: Partial<ProfileFormData>;
  onSubmit: (data: ProfileFormData) => Promise<void>;
}

const ValidatedProfileForm: React.FC<ValidatedProfileFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const { t } = useTranslation('common');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData || {
      name: '',
      email: '',
      phone: '',
      title: '',
    },
  });

  const onSubmitHandler = async (data: ProfileFormData) => {
    try {
      await onSubmit(data);
      toast.success('Profil başarıyla güncellendi!');
    } catch (error) {
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
      logger.error('Form submit error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
      {/* Name Field */}
      <div>
        <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700 mb-2">
          {t('forms.nameLabel')} <span className="text-red-500">*</span>
        </label>
        <input
          id="profile-name"
          type="text"
          {...register('name')}
          className={`w-full px-4 py-2.5 border ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors`}
          placeholder={t('forms.namePlaceholder')}
        />
        {errors.name && (
          <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
            <span>⚠️</span> {errors.name.message}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700 mb-2">
          E-posta <span className="text-red-500">*</span>
        </label>
        <input
          id="profile-email"
          type="email"
          {...register('email')}
          className={`w-full px-4 py-2.5 border ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors`}
          placeholder="ornek@asistanapp.com"
        />
        {errors.email && (
          <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
            <span>⚠️</span> {errors.email.message}
          </p>
        )}
      </div>

      {/* Phone Field (Optional) */}
      <div>
        <label htmlFor="profile-phone" className="block text-sm font-medium text-gray-700 mb-2">
          Telefon (Opsiyonel)
        </label>
        <input
          id="profile-phone"
          type="tel"
          {...register('phone')}
          className={`w-full px-4 py-2.5 border ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors`}
          placeholder="5551234567"
        />
        {errors.phone && (
          <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
            <span>⚠️</span> {errors.phone.message}
          </p>
        )}
      </div>

      {/* Title Field (Optional) */}
      <div>
        <label htmlFor="profile-title" className="block text-sm font-medium text-gray-700 mb-2">
          {t('forms.titleLabel')}
        </label>
        <input
          id="profile-title"
          type="text"
          {...register('title')}
          className={`w-full px-4 py-2.5 border ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors`}
          placeholder={t('forms.titlePlaceholder')}
        />
        {errors.title && (
          <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
            <span>⚠️</span> {errors.title.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
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
              {t('saving')}
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {t('save')}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ValidatedProfileForm;

