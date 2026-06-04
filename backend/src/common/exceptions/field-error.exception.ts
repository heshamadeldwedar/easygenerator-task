import { HttpException, HttpStatus } from '@nestjs/common'

export interface FieldError {
  field: string
  message: string
}

/**
 * Exception that carries field-level validation errors.
 * Used for conflicts, validation failures, and other errors
 * that should be mapped to specific form fields.
 */
export class FieldErrorException extends HttpException {
  constructor(
    public readonly errors: FieldError[],
    public readonly detail: string = 'Validation failed',
    status: HttpStatus = HttpStatus.UNPROCESSABLE_ENTITY,
  ) {
    super(
      {
        message: detail,
        errors,
      },
      status,
    )
  }

  /**
   * Convenience factory for single-field conflicts (e.g., duplicate email)
   */
  static conflict(field: string, message: string): FieldErrorException {
    return new FieldErrorException([{ field, message }], message, HttpStatus.CONFLICT)
  }

  /**
   * Convenience factory for validation errors
   */
  static validation(errors: FieldError[]): FieldErrorException {
    return new FieldErrorException(errors, 'Validation failed', HttpStatus.UNPROCESSABLE_ENTITY)
  }
}
