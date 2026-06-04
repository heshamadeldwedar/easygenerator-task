import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'

interface FieldError {
  field: string
  message: string
}

interface ErrorBody {
  type: string
  title: string
  status: number
  detail: string
  errors?: FieldError[]
}

interface ErrorResponse {
  success: false
  error: ErrorBody
  requestId: string
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter')

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()
    const request = ctx.getRequest<FastifyRequest>()

    const requestId =
      (request.raw as FastifyRequest['raw'] & { requestId?: string }).requestId ||
      (request.headers['x-request-id'] as string) ||
      'unknown'

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let type = 'about:blank'
    let title = 'Internal Server Error'
    let detail = 'An unexpected error occurred'
    let errors: FieldError[] | undefined

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const exceptionResponse = exception.getResponse()

      if (typeof exceptionResponse === 'string') {
        title = exceptionResponse
        detail = exceptionResponse
      } else if (typeof exceptionResponse === 'object') {
        const res = exceptionResponse as Record<string, unknown>

        title = (res.error as string) || exception.name || this.getStatusTitle(status)
        type = this.getErrorType(status)

        // Handle class-validator errors (array of messages)
        if (Array.isArray(res.message)) {
          errors = this.formatValidationErrors(res.message)
          detail = 'Validation failed'
          // Override status to 422 for validation errors
          status = HttpStatus.UNPROCESSABLE_ENTITY
          title = 'Validation Error'
          type = 'validation-error'
        } else {
          detail = (res.message as string) || exception.message
        }
      }
    } else if (exception instanceof Error) {
      detail = exception.message
      this.logger.error(`[${requestId}] Unhandled exception: ${exception.message}`, exception.stack)
    }

    // Ensure X-Request-Id header is set
    response.header('X-Request-Id', requestId)

    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        type,
        title,
        status,
        detail,
        ...(errors && { errors }),
      },
      requestId,
    }

    response.status(status).send(errorResponse)
  }

  private formatValidationErrors(messages: string[]): FieldError[] {
    return messages.map((message) => {
      // Try to extract field name from message pattern "fieldName must be..."
      const match = message.match(/^(\w+)\s+/)
      const field = match ? match[1] : 'unknown'
      return { field, message }
    })
  }

  private getStatusTitle(status: number): string {
    const titles: Record<number, string> = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      409: 'Conflict',
      422: 'Unprocessable Entity',
      500: 'Internal Server Error',
    }
    return titles[status] || 'Error'
  }

  private getErrorType(status: number): string {
    const types: Record<number, string> = {
      400: 'bad-request',
      401: 'unauthorized',
      403: 'forbidden',
      404: 'not-found',
      409: 'conflict',
      422: 'validation-error',
      500: 'internal-error',
    }
    return types[status] || 'about:blank'
  }
}
