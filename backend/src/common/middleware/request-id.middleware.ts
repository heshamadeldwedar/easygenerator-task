import { Injectable, NestMiddleware } from '@nestjs/common'
import { FastifyRequest, FastifyReply } from 'fastify'
import { ulid } from 'ulid'

declare module 'fastify' {
  interface FastifyRequest {
    requestId: string
  }
}

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
    const incomingRequestId =
      (req.headers['x-request-id'] as string) || (req.headers['X-Request-Id'] as string)
    const requestId = incomingRequestId || ulid()

    // Attach to raw request for access in interceptors/filters
    ;(req as FastifyRequest['raw'] & { requestId: string }).requestId = requestId

    // Set response header
    res.setHeader('X-Request-Id', requestId)

    next()
  }
}
