import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { FastifyRequest, FastifyReply } from 'fastify'

export interface SuccessResponse<T> {
  success: true
  data: T
  requestId: string
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, SuccessResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<SuccessResponse<T>> {
    const ctx = context.switchToHttp()
    const request = ctx.getRequest<FastifyRequest>()
    const response = ctx.getResponse<FastifyReply>()

    // Get requestId from raw request (set by middleware)
    const requestId =
      (request.raw as FastifyRequest['raw'] & { requestId?: string }).requestId ||
      (request.headers['x-request-id'] as string) ||
      'unknown'

    // Ensure X-Request-Id header is set on response
    response.header('X-Request-Id', requestId)

    return next.handle().pipe(
      map((data) => ({
        success: true as const,
        data,
        requestId,
      })),
    )
  }
}
