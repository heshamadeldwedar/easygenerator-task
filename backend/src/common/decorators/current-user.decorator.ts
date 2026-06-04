import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export interface CurrentUserPayload {
  id: string
  email: string
  permissions: string[]
}

interface RequestWithUser {
  user?: CurrentUserPayload
}

export const CurrentUser = createParamDecorator(
  (data: keyof CurrentUserPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>()
    const user = request.user

    if (!user) {
      return undefined
    }

    return data ? user[data] : user
  },
)
