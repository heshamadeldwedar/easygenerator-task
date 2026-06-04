import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'
import { Input, PasswordInput, PasswordChecklist, Button } from '@/components'
import { signupSchema, type SignupFormData } from '@/schemas/auth'
import { signup } from '@/api/auth'
import { useAuth } from '@/context/AuthContext'
import type { AxiosError } from 'axios'

interface ApiError {
  message?: string
}

export function SignUp() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange', // Enable live validation for password checklist
    defaultValues: {
      email: '',
      name: '',
      password: '',
    },
  })

  const password = watch('password', '')

  const onSubmit = async (data: SignupFormData) => {
    try {
      setServerError('')
      const response = await signup(data)
      login(response.user, response.accessToken)
      navigate('/dashboard')
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>
      setServerError(
        axiosError.response?.data?.message || 'Something went wrong. Please try again.'
      )
    }
  }

  return (
    <AuthLayout>
      <h1 className="m-0 mb-1 font-display font-semibold text-h1 tracking-[-0.015em] leading-snug max-sm:text-[1.625rem]">
        Create your account
      </h1>
      <p className="m-0 mb-[1.375rem] text-ink-500 text-base font-semibold">
        Start your learning journey today
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

        <Input
          label="Name"
          type="text"
          placeholder="Your full name"
          autoComplete="name"
          error={errors.name?.message}
          {...register('name')}
        />

        <PasswordInput
          label="Password"
          placeholder="Create a password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />

        <PasswordChecklist password={password} />

        {serverError && (
          <p className="text-error text-sm font-bold mt-4" role="alert">
            {serverError}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting} className="mt-6">
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <p className="text-center mt-[1.125rem] text-sm text-ink-500 font-semibold">
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
