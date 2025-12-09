/**
 * Authentication Form Validation Schemas
 * 
 * Zod schemas for all authentication-related forms
 * - Login
 * - Register
 * - Password Reset
 * - Change Password
 */

import { z } from 'zod';

/**
 * Email validation
 */
const emailSchema = z
  .string()
  .min(1, 'Email gereklidir')
  .email('Geçerli bir email adresi girin')
  .toLowerCase()
  .trim();

/**
 * Password validation
 * Requirements:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
const passwordSchema = z
  .string()
  .min(8, 'Şifre en az 8 karakter olmalı')
  .regex(/[A-Z]/, 'En az bir büyük harf gerekli')
  .regex(/[a-z]/, 'En az bir küçük harf gerekli')
  .regex(/[0-9]/, 'En az bir rakam gerekli')
  .regex(/[^A-Za-z0-9]/, 'En az bir özel karakter gerekli (!@#$%^&* vb.)');

/**
 * Simple password (for development/testing)
 */
const simplePasswordSchema = z
  .string()
  .min(6, 'Şifre en az 6 karakter olmalı');

/**
 * Phone number validation (Turkish format)
 */
const phoneSchema = z
  .string()
  .regex(/^0\d{10}$/, 'Geçerli telefon numarası girin (örn: 05301234567)')
  .optional()
  .or(z.literal(''));

/**
 * Login Schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: simplePasswordSchema, // Use simple password for easier testing
  rememberMe: z.boolean().optional().default(false),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Register Schema
 */
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Şifre tekrarı gereklidir'),
  firstName: z.string().min(1, 'Ad gereklidir').max(50, 'Ad çok uzun'),
  lastName: z.string().min(1, 'Soyad gereklidir').max(50, 'Soyad çok uzun'),
  phone: phoneSchema,
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Kullanım koşullarını kabul etmelisiniz',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Forgot Password Schema
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Reset Password Schema
 */
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token gereklidir'),
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Şifre tekrarı gereklidir'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * Change Password Schema
 */
export const changePasswordSchema = z.object({
  currentPassword: simplePasswordSchema,
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, 'Şifre tekrarı gereklidir'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Yeni şifreler eşleşmiyor',
  path: ['confirmPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'Yeni şifre eski şifreden farklı olmalı',
  path: ['newPassword'],
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

/**
 * Agent Login Schema (may have different requirements)
 */
export const agentLoginSchema = loginSchema;

export type AgentLoginFormData = z.infer<typeof agentLoginSchema>;

/**
 * Admin Login Schema (may have different requirements)
 */
export const adminLoginSchema = loginSchema.extend({
  mfaCode: z.string().length(6, 'MFA kodu 6 haneli olmalı').optional(),
});

export type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

