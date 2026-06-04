import type { UseFormSetError, FieldValues, Path } from 'react-hook-form'
import type { AxiosError } from 'axios'

/**
 * Backend field error structure.
 * The API returns errors in the format: { errors: [{ field, message }] }
 */
interface FieldError {
  field: string
  message: string
}

/**
 * Backend error envelope structure.
 * Response format: { success: false, error: { type, title, status, detail, errors? }, requestId }
 */
interface ErrorEnvelope {
  type?: string
  title?: string
  status?: number
  detail?: string
  errors?: FieldError[]
}

/**
 * API error response envelope.
 * The backend wraps errors in { success, error: {...}, requestId }
 */
interface ApiErrorResponse {
  success?: boolean
  error?: ErrorEnvelope
  requestId?: string
}

/**
 * Maps backend validation errors to react-hook-form field errors.
 *
 * Handles:
 * - 422 Unprocessable Entity with field-level errors array
 * - 409 Conflict (e.g., email already exists) with field-level errors
 * - 400 Bad Request with field-level errors array
 * - Generic server errors as form-level messages
 *
 * @param error - Axios error from API call
 * @param setError - react-hook-form setError function
 * @param formFields - Array of valid form field names for validation
 * @returns Fallback error message for form-level display, or null if all errors were mapped to fields
 *
 * @example
 * ```ts
 * const fallbackError = mapApiErrorsToFields(
 *   error,
 *   setError,
 *   ['email', 'name', 'password']
 * )
 * if (fallbackError) {
 *   setServerError(fallbackError)
 * }
 * ```
 */
export function mapApiErrorsToFields<T extends FieldValues>(
  error: AxiosError,
  setError: UseFormSetError<T>,
  formFields: string[]
): string | null {
  const response = error.response
  if (!response) {
    return 'Network error. Please check your connection and try again.'
  }

  const { status } = response
  const data = response.data as ApiErrorResponse | undefined
  const fieldSet = new Set(formFields)
  let hasFieldErrors = false

  // Extract errors from the envelope structure: { error: { errors: [...] } }
  const errorEnvelope = data?.error
  const errors = errorEnvelope?.errors

  // Handle field-level errors array (422, 409, 400, etc.)
  if (errors && Array.isArray(errors)) {
    for (const fieldError of errors) {
      if (fieldError.field && fieldSet.has(fieldError.field)) {
        setError(fieldError.field as Path<T>, {
          type: 'server',
          message: fieldError.message,
        })
        hasFieldErrors = true
      }
    }
  }

  // If we mapped field errors, don't show a general error
  if (hasFieldErrors) {
    return null
  }

  // Handle 401 Unauthorized
  if (status === 401) {
    return 'Invalid email or password'
  }

  // Fallback to general error message from envelope
  return errorEnvelope?.detail || 'Something went wrong. Please try again.'
}
