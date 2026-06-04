import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'
import { Input, PasswordInput, Button } from '@/components'
import { signinSchema, type SigninFormData } from '@/schemas/auth'
import { signin } from '@/api/auth'
import { useAuth } from '@/context/AuthContext'
import { mapApiErrorsToFields } from '@/utils/formErrors'
import type { AxiosError } from 'axios'

const FORM_FIELDS = ['email', 'password'] as const

export function SignIn() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting, dirtyFields, touchedFields },
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const email = watch('email', '')
  const password = watch('password', '')

  // Field is valid when: touched, dirty, has value, and no error
  const isFieldValid = (field: keyof SigninFormData, value: string) =>
    touchedFields[field] && dirtyFields[field] && value.length > 0 && !errors[field]

  const onSubmit = async (data: SigninFormData) => {
    try {
      setServerError('')
      const response = await signin(data)
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
        Welcome back
      </h1>
      <p className="m-0 mb-6 text-ink-500 text-base font-semibold">
        Sign in to continue learning
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

        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          error={errors.password?.message}
          valid={isFieldValid('password', password)}
          {...register('password')}
        />

        {serverError && (
          <p className="text-error text-sm font-bold mt-5" role="alert">
            {serverError}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting} className="mt-8">
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <p className="text-center mt-5 text-sm text-ink-500 font-semibold">
        Don&apos;t have an account?{' '}
        <Link
          to="/signup"
          className="text-coral-700 font-extrabold no-underline hover:underline hover:underline-offset-[3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500 focus-visible:ring-offset-2 rounded-sm"
        >
          Sign up
        </Link>
      </p>
    </AuthLayout>
  )
}
