import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'
import { Input, PasswordInput, Button } from '@/components'
import { signinSchema, type SigninFormData } from '@/schemas/auth'
import { signin } from '@/api/auth'
import { useAuth } from '@/context/AuthContext'
import type { AxiosError } from 'axios'

interface ApiError {
  message?: string
}

export function SignIn() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: SigninFormData) => {
    try {
      setServerError('')
      const response = await signin(data)
      login(response.user, response.accessToken)
      navigate('/dashboard')
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>
      if (axiosError.response?.status === 401) {
        setServerError('Invalid email or password')
      } else {
        setServerError(
          axiosError.response?.data?.message || 'Something went wrong. Please try again.'
        )
      }
    }
  }

  return (
    <AuthLayout>
      <h1 className="m-0 mb-1 font-display font-semibold text-h1 tracking-[-0.015em] leading-snug max-sm:text-[1.625rem]">
        Welcome back
      </h1>
      <p className="m-0 mb-[1.375rem] text-ink-500 text-base font-semibold">
        Sign in to continue learning
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />

        {serverError && (
          <p className="text-error text-sm font-bold mt-4" role="alert">
            {serverError}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting} className="mt-6">
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <p className="text-center mt-[1.125rem] text-sm text-ink-500 font-semibold">
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
