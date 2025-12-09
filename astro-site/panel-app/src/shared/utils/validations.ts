/**
 * Form Validation Schemas using Zod
 * Production-ready validation rules
 */
import { z } from 'zod';

// ===========================
// COMMON VALIDATION SCHEMAS
// ===========================

export const emailSchema = z
  .string()
  .min(1, 'Email gereklidir')
  .email('Geçerli bir email adresi giriniz');

export const passwordSchema = z
  .string()
  .min(8, 'Şifre en az 8 karakter olmalıdır')
  .regex(/[A-Z]/, 'Şifre en az bir büyük harf içermelidir')
  .regex(/[a-z]/, 'Şifre en az bir küçük harf içermelidir')
  .regex(/[0-9]/, 'Şifre en az bir rakam içermelidir');

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Geçerli bir telefon numarası giriniz')
  .optional()
  .or(z.literal(''));

export const nameSchema = z
  .string()
  .min(2, 'Ad en az 2 karakter olmalıdır')
  .max(100, 'Ad en fazla 100 karakter olabilir')
  .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, 'Ad sadece harf içerebilir');

// ===========================
// USER & TEAM MANAGEMENT
// ===========================

export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  tenant: z.string().min(1, 'Firma seçimi zorunludur'),
  role: z.enum(['owner', 'admin', 'manager', 'agent'], {
    errorMap: () => ({ message: 'Geçerli bir rol seçiniz' }),
  }),
  password: passwordSchema,
});

export const updateUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  role: z.enum(['owner', 'admin', 'manager', 'agent'], {
    errorMap: () => ({ message: 'Geçerli bir rol seçiniz' }),
  }),
  status: z.enum(['active', 'inactive'], {
    errorMap: () => ({ message: 'Geçerli bir durum seçiniz' }),
  }),
});

export const createTeamMemberSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  role: z.enum(['owner', 'admin', 'agent', 'viewer'], {
    errorMap: () => ({ message: 'Geçerli bir rol seçiniz' }),
  }),
  department: z.string().min(1, 'Departman zorunludur'),
});

export const updateTeamMemberSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  department: z.string().min(1, 'Departman zorunludur'),
  role: z.enum(['owner', 'admin', 'agent', 'viewer'], {
    errorMap: () => ({ message: 'Geçerli bir rol seçiniz' }),
  }),
  status: z.enum(['active', 'inactive', 'on_leave'], {
    errorMap: () => ({ message: 'Geçerli bir durum seçiniz' }),
  }),
});

// ===========================
// AUTHENTICATION
// ===========================

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Şifre gereklidir'),
});

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Şifre onayı gereklidir'),
  companyName: z.string().min(2, 'Şirket adı en az 2 karakter olmalıdır'),
  phone: phoneSchema,
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Kullanım koşullarını kabul etmelisiniz',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Şifre onayı gereklidir'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
});

// ===========================
// COMPANY/TENANT
// ===========================

export const createTenantSchema = z.object({
  name: z.string().min(2, 'Firma adı en az 2 karakter olmalıdır'),
  email: emailSchema,
  phone: phoneSchema,
  industry: z.string().min(1, 'Sektör seçimi zorunludur'),
  plan: z.enum(['free', 'starter', 'professional', 'enterprise'], {
    errorMap: () => ({ message: 'Geçerli bir plan seçiniz' }),
  }),
  address: z.string().optional(),
  website: z.string().url('Geçerli bir URL giriniz').optional().or(z.literal('')),
});

// ===========================
// SETTINGS
// ===========================

export const businessSettingsSchema = z.object({
  businessName: z.string().min(2, 'İşletme adı en az 2 karakter olmalıdır'),
  businessType: z.string().min(1, 'İşletme türü seçimi zorunludur'),
  website: z.string().url('Geçerli bir URL giriniz').optional().or(z.literal('')),
  email: emailSchema,
  phone: phoneSchema,
  address: z.string().optional(),
});

export const aiSettingsSchema = z.object({
  aiEnabled: z.boolean(),
  temperature: z.number().min(0, 'Minimum 0').max(1, 'Maksimum 1'),
  maxTokens: z.number().min(100, 'Minimum 100').max(4000, 'Maksimum 4000'),
  responseStyle: z.enum(['professional', 'friendly', 'casual'], {
    errorMap: () => ({ message: 'Geçerli bir stil seçiniz' }),
  }),
  language: z.string().min(1, 'Dil seçimi zorunludur'),
});

// ===========================
// CHAT & MESSAGING
// ===========================

export const sendMessageSchema = z.object({
  content: z.string().min(1, 'Mesaj içeriği boş olamaz').max(5000, 'Mesaj çok uzun'),
  conversationId: z.string().min(1, 'Konuşma ID gereklidir'),
  attachments: z.array(z.string()).optional(),
});

export const createQuickReplySchema = z.object({
  title: z.string().min(1, 'Başlık gereklidir').max(100, 'Başlık çok uzun'),
  content: z.string().min(1, 'İçerik gereklidir').max(2000, 'İçerik çok uzun'),
  category: z.string().optional(),
  isActive: z.boolean().default(true),
});

// ===========================
// TYPE EXPORTS
// ===========================

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateTeamMemberInput = z.infer<typeof createTeamMemberSchema>;
export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateTenantInput = z.infer<typeof createTenantSchema>;
export type BusinessSettingsInput = z.infer<typeof businessSettingsSchema>;
export type AISettingsInput = z.infer<typeof aiSettingsSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type CreateQuickReplyInput = z.infer<typeof createQuickReplySchema>;



