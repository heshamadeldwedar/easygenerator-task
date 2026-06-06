import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

/**
 * Field-level validation error
 */
export class FieldErrorDto {
  @ApiProperty({ description: 'Field name that has the error', example: 'email' })
  field!: string

  @ApiProperty({ description: 'Error message for the field', example: 'email must be a valid email' })
  message!: string
}

/**
 * Error body following RFC 7807 Problem Details structure
 */
export class ErrorBodyDto {
  @ApiProperty({
    description: 'Error type identifier',
    example: 'validation-error',
    enum: ['validation-error', 'conflict', 'unauthorized', 'forbidden', 'not-found', 'bad-request', 'internal-error', 'about:blank'],
  })
  type!: string

  @ApiProperty({ description: 'Human-readable error title', example: 'Validation Error' })
  title!: string

  @ApiProperty({ description: 'HTTP status code', example: 422 })
  status!: number

  @ApiProperty({ description: 'Detailed error message', example: 'Validation failed' })
  detail!: string

  @ApiPropertyOptional({
    description: 'Field-level errors (for validation/conflict errors)',
    type: [FieldErrorDto],
  })
  errors?: FieldErrorDto[]
}

/**
 * Standard error response wrapper
 */
export class ErrorResponseDto {
  @ApiProperty({ description: 'Indicates request failure', example: false, enum: [false] })
  success!: boolean

  @ApiProperty({ type: ErrorBodyDto })
  error!: ErrorBodyDto

  @ApiProperty({ description: 'Unique request identifier for tracing', example: 'abc123-def456' })
  requestId!: string
}

/**
 * 401 Unauthorized error response
 */
export class UnauthorizedResponseDto {
  @ApiProperty({ example: false, enum: [false] })
  success!: boolean

  @ApiProperty({
    example: {
      type: 'unauthorized',
      title: 'Unauthorized',
      status: 401,
      detail: 'Invalid credentials',
    },
  })
  error!: ErrorBodyDto

  @ApiProperty({ example: 'abc123-def456' })
  requestId!: string
}

/**
 * 409 Conflict error response
 */
export class ConflictResponseDto {
  @ApiProperty({ example: false, enum: [false] })
  success!: boolean

  @ApiProperty({
    example: {
      type: 'conflict',
      title: 'Conflict',
      status: 409,
      detail: 'This email is already registered',
      errors: [{ field: 'email', message: 'This email is already registered' }],
    },
  })
  error!: ErrorBodyDto

  @ApiProperty({ example: 'abc123-def456' })
  requestId!: string
}

/**
 * 422 Validation error response
 */
export class ValidationErrorResponseDto {
  @ApiProperty({ example: false, enum: [false] })
  success!: boolean

  @ApiProperty({
    example: {
      type: 'validation-error',
      title: 'Validation Error',
      status: 422,
      detail: 'Validation failed',
      errors: [
        { field: 'email', message: 'email must be a valid email' },
        { field: 'password', message: 'password must be at least 8 characters' },
      ],
    },
  })
  error!: ErrorBodyDto

  @ApiProperty({ example: 'abc123-def456' })
  requestId!: string
}
