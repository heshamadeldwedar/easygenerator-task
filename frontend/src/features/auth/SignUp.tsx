import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'
import { Input, PasswordInput, PasswordChecklist, Button } from '@/components'
import { signupSchema, type SignupFormData } from '@/schemas/auth'
import { signup } from '@/api/auth'
import { useAuth } from '@/context/AuthContext'
import { mapApiErrorsToFields } from '@/utils/formErrors'
import type { AxiosError } from 'axios'

const FORM_FIELDS = ['email', 'name', 'password'] as const

export function SignUp() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting, dirtyFields, touchedFields },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      name: '',
      password: '',
    },
  })

  const password = watch('password', '')
  const email = watch('email', '')
  const name = watch('name', '')

  // Field is valid when: touched, dirty, has value, and no error
  const isFieldValid = (field: keyof SignupFormData, value: string) =>
    touchedFields[field] && dirtyFields[field] && value.length > 0 && !errors[field]

  const onSubmit = async (data: SignupFormData) => {
    try {
      setServerError('')
      const response = await signup(data)
      login(response.user, response.accessToken)
      navigate('/dashboard')
    } catch (error) {
      const fallbackError = mapApiErrorsToFields(
        error as AxiosError,
        setError,
        [...FORM_FIELDS]
      )
      if (fallbackError) {
        setServerError(fallbackError)
      }
    }
  }

  return (
    <AuthLayout>
      <h1 className="m-0 mb-2 font-display font-semibold text-h1 tracking-[-0.015em] leading-snug max-sm:text-[1.625rem]">
        Create your account
      </h1>
      <p className="m-0 mb-6 text-ink-500 text-base font-semibold">
        Start your learning journey today
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          valid={isFieldValid('email', email)}
          {...register('email')}
        />

        <Input
          label="Name"
          type="text"
          placeholder="Your full name"
          autoComplete="name"
          error={errors.name?.message}
          valid={isFieldValid('name', name)}
          {...register('name')}
        />

        <PasswordInput
          label="Password"
          placeholder="Create a password"
          autoComplete="new-password"
          error={errors.password?.message}
          valid={isFieldValid('password', password)}
          {...register('password')}
        />

        <PasswordChecklist password={password} />

        {serverError && (
          <p className="text-error text-sm font-bold mt-5" role="alert">
            {serverError}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting} className="mt-8">
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <p className="text-center mt-5 text-sm text-ink-500 font-semibold">
        Already have an account?{' '}
        <Link
          to="/signin"
          className="text-coral-700 font-extrabold no-underline hover:underline hover:underline-offset-[3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500 focus-visible:ring-offset-2 rounded-sm"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
