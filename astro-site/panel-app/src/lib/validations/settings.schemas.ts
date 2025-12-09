/**
 * Settings Form Validation Schemas
 * Using Zod for type-safe validation
 */
import { z } from 'zod';

// Profile Settings Schema
export const profileSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır').max(50, 'İsim en fazla 50 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  phone: z.string().regex(/^[0-9]{10,11}$/, 'Geçerli bir telefon numarası giriniz').optional().or(z.literal('')),
  title: z.string().min(2, 'Unvan en az 2 karakter olmalıdır').optional().or(z.literal('')),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// Business Settings Schema
export const businessSchema = z.object({
  businessName: z.string().min(2, 'İşletme adı en az 2 karakter olmalıdır'),
  businessType: z.string().min(1, 'İşletme türü seçiniz'),
  taxNumber: z.string().regex(/^[0-9]{10,11}$/, 'Geçerli bir vergi numarası giriniz').optional().or(z.literal('')),
  address: z.string().min(5, 'Adres en az 5 karakter olmalıdır'),
  city: z.string().min(2, 'Şehir en az 2 karakter olmalıdır'),
  country: z.string().min(2, 'Ülke en az 2 karakter olmalıdır'),
  website: z.string().url('Geçerli bir URL giriniz').optional().or(z.literal('')),
});

export type BusinessFormData = z.infer<typeof businessSchema>;

// AI Settings Schema
export const aiSettingsSchema = z.object({
  assistantName: z.string().min(2, 'Asistan adı en az 2 karakter olmalıdır'),
  language: z.string().min(1, 'Dil seçiniz'),
  tone: z.enum(['formal', 'friendly', 'professional']),
  autoResponse: z.boolean(),
  responseDelay: z.number().min(0).max(60),
  maxTokens: z.number().min(100).max(4000),
});

export type AISettingsFormData = z.infer<typeof aiSettingsSchema>;

// Team Member Schema
export const teamMemberSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  role: z.enum(['admin', 'agent', 'viewer']),
  phone: z.string().regex(/^[0-9]{10,11}$/, 'Geçerli bir telefon numarası giriniz').optional().or(z.literal('')),
});

export type TeamMemberFormData = z.infer<typeof teamMemberSchema>;

// Appointment Settings Schema
export const appointmentSettingsSchema = z.object({
  enabled: z.boolean(),
  duration: z.number().min(15).max(180),
  bufferTime: z.number().min(0).max(60),
  advanceBooking: z.number().min(1).max(90),
  workingHours: z.object({
    start: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Geçerli saat formatı (HH:MM)'),
    end: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Geçerli saat formatı (HH:MM)'),
  }),
});

export type AppointmentSettingsFormData = z.infer<typeof appointmentSettingsSchema>;

// Password Change Schema
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(6, 'Mevcut şifrenizi giriniz'),
  newPassword: z.string()
    .min(8, 'Şifre en az 8 karakter olmalıdır')
    .regex(/[A-Z]/, 'Şifre en az bir büyük harf içermelidir')
    .regex(/[a-z]/, 'Şifre en az bir küçük harf içermelidir')
    .regex(/[0-9]/, 'Şifre en az bir rakam içermelidir'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
});

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

// Support Request Schema
export const supportRequestSchema = z.object({
  subject: z.string().min(5, 'Konu en az 5 karakter olmalıdır'),
  category: z.enum(['technical', 'billing', 'feature', 'other']),
  priority: z.enum(['low', 'medium', 'high']),
  message: z.string().min(20, 'Mesaj en az 20 karakter olmalıdır'),
  attachments: z.array(z.instanceof(File)).optional(),
});

export type SupportRequestFormData = z.infer<typeof supportRequestSchema>;

