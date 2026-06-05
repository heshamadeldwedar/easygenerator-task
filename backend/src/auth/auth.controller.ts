import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { FastifyRequest, FastifyReply } from 'fastify'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
} from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { SignupDto } from './dto/signup.dto'
import { SigninDto } from './dto/signin.dto'
import { Public } from '@/common/decorators/public.decorator'
import { CurrentUser, CurrentUserPayload } from '@/common/decorators/current-user.decorator'
import { RequirePermissions } from '@/common/decorators/require-permissions.decorator'
import { Permissions } from '@/common/constants/permissions'
import { REFRESH_COOKIE_MAX_AGE_SECONDS } from '@/common/constants/auth.constants'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('signup')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: SignupDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
          },
        },
        accessToken: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  @ApiResponse({ status: 422, description: 'Validation failed' })
  async signup(@Body() dto: SignupDto, @Res({ passthrough: true }) response: FastifyReply) {
    const result = await this.authService.signup(dto)
    this.setRefreshCookie(response, result.refreshToken)
    return { user: result.user, accessToken: result.accessToken }
  }

  @Post('signin')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate user' })
  @ApiBody({ type: SigninDto })
  @ApiResponse({
    status: 200,
    description: 'Authentication successful',
    schema: {
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
          },
        },
        accessToken: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async signin(@Body() dto: SigninDto, @Res({ passthrough: true }) response: FastifyReply) {
    const result = await this.authService.signin(dto)
    this.setRefreshCookie(response, result.refreshToken)
    return { user: result.user, accessToken: result.accessToken }
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh token cookie' })
  @ApiCookieAuth('refresh_token')
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    schema: {
      properties: {
        accessToken: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refresh(@Req() request: FastifyRequest, @Res({ passthrough: true }) response: FastifyReply) {
    const oldToken = request.cookies?.refresh_token
    if (!oldToken) {
      this.clearRefreshCookie(response)
      throw new UnauthorizedException('No refresh token provided')
    }

    try {
      const result = await this.authService.refresh(oldToken)
      this.setRefreshCookie(response, result.refreshToken)
      return { accessToken: result.accessToken }
    } catch (error) {
      this.clearRefreshCookie(response)
      throw error
    }
  }

  @Post('logout')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout and revoke refresh token' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(@Req() request: FastifyRequest, @Res({ passthrough: true }) response: FastifyReply) {
    const refreshToken = request.cookies?.refresh_token
    if (refreshToken) {
      await this.authService.logout(refreshToken)
    }
    this.clearRefreshCookie(response)
    return { message: 'Logged out successfully' }
  }

  @Get('me')
  @RequirePermissions(Permissions.USER_READ_SELF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Current user profile',
    schema: {
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        name: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async me(@CurrentUser() user: CurrentUserPayload) {
    return this.authService.getUser(user.id)
  }

  private setRefreshCookie(response: FastifyReply, token: string) {
    const isProduction = this.configService.get('NODE_ENV') === 'production'
    response.setCookie('refresh_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: REFRESH_COOKIE_MAX_AGE_SECONDS,
    })
  }

  private clearRefreshCookie(response: FastifyReply) {
    response.clearCookie('refresh_token', {
      path: '/',
    })
  }
}
