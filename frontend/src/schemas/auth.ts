import { z } from 'zod'

/**
 * Validation rules (mirrors backend DTOs)
 * - Email: valid email format
 * - Name: minimum 3 characters
 * - Password: minimum 8 chars, at least one letter, one number, one special char
 */

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')

export const nameSchema = z
  .string()
  .min(3, 'Name must be at least 3 characters')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(
    /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\;'`~]/,
    'Password must contain at least one special character'
  )

export const signupSchema = z.object({
  email: emailSchema,
  name: nameSchema,
  password: passwordSchema,
})

export const signinSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export type SignupFormData = z.infer<typeof signupSchema>
export type SigninFormData = z.infer<typeof signinSchema>

/**
 * Password requirement checks for live validation
 */
export const passwordRequirements = [
  { id: 'length', label: '8+ characters', test: (p: string) => p.length >= 8 },
  { id: 'letter', label: 'One letter', test: (p: string) => /[a-zA-Z]/.test(p) },
  { id: 'number', label: 'One number', test: (p: string) => /\d/.test(p) },
  {
    id: 'special',
    label: 'One special char',
    test: (p: string) => /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\;'`~]/.test(p),
  },
] as const
