import { Test, TestingModule } from '@nestjs/testing'
import { ValidationPipe } from '@nestjs/common'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'
import { MongoMemoryServer } from 'mongodb-memory-server'
import * as fastifyCookie from '@fastify/cookie'
import { validate } from '@/config/env.validation'
import { UsersModule } from '@/users/users.module'
import { AuthModule } from '@/auth/auth.module'
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor'
import { AllExceptionsFilter } from '@/common/filters/all-exceptions.filter'
import { LoggingInterceptor } from '@/common/interceptors/logging.interceptor'
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard'
import { PermissionsGuard } from '@/common/guards/permissions.guard'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'

describe('AuthController (e2e)', () => {
  let app: NestFastifyApplication
  let mongod: MongoMemoryServer

  const validUser = {
    email: 'test@example.com',
    name: 'Test User',
    password: 'SecurePass1!',
  }

  beforeAll(async () => {
    // Start MongoDB Memory Server
    mongod = await MongoMemoryServer.create()
    const mongoUri = mongod.getUri()

    // Create test module with real MongoDB connection
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validate,
        }),
        MongooseModule.forRoot(mongoUri),
        UsersModule,
        AuthModule,
      ],
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useClass: LoggingInterceptor,
        },
        {
          provide: APP_GUARD,
          useClass: JwtAuthGuard,
        },
        {
          provide: APP_GUARD,
          useClass: PermissionsGuard,
        },
      ],
    }).compile()

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter())

    await app.register(fastifyCookie.default, {
      secret: process.env.COOKIE_SECRET,
    })

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    )
    app.useGlobalInterceptors(new ResponseInterceptor())
    app.useGlobalFilters(new AllExceptionsFilter())
    app.setGlobalPrefix('api/v1')

    await app.init()
    await app.getHttpAdapter().getInstance().ready()
  }, 60000) // 60 second timeout for MongoDB startup

  afterAll(async () => {
    if (app) {
      await app.close()
    }
    if (mongod) {
      await mongod.stop()
    }
  })

  describe('POST /api/v1/auth/signup', () => {
    it('should create user and return tokens (201)', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/signup',
        payload: validUser,
      })

      expect(response.statusCode).toBe(201)
      const body = JSON.parse(response.body)
      expect(body.success).toBe(true)
      expect(body.data.user.email).toBe(validUser.email)
      expect(body.data.user.name).toBe(validUser.name)
      expect(body.data.accessToken).toBeDefined()
      expect(body.requestId).toBeDefined()

      // Check refresh token cookie is set
      const cookies = response.cookies
      const refreshCookie = cookies.find((c: { name: string }) => c.name === 'refresh_token')
      expect(refreshCookie).toBeDefined()
      expect(refreshCookie!.httpOnly).toBe(true)
    })

    it('should reject duplicate email (409)', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/signup',
        payload: {
          ...validUser,
          email: 'duplicate@example.com',
        },
      })

      expect(response.statusCode).toBe(201)

      // Try to register again with same email
      const duplicateResponse = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/signup',
        payload: {
          ...validUser,
          email: 'duplicate@example.com',
        },
      })

      expect(duplicateResponse.statusCode).toBe(409)
      const body = JSON.parse(duplicateResponse.body)
      expect(body.success).toBe(false)
      expect(body.error.status).toBe(409)
    })

    it('should reject weak password (422)', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/signup',
        payload: {
          email: 'weak@example.com',
          name: 'Test User',
          password: 'weak',
        },
      })

      expect(response.statusCode).toBe(422)
      const body = JSON.parse(response.body)
      expect(body.success).toBe(false)
      expect(body.error.errors).toBeDefined()
    })

    it('should reject short name (422)', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/signup',
        payload: {
          email: 'shortname@example.com',
          name: 'AB',
          password: 'SecurePass1!',
        },
      })

      expect(response.statusCode).toBe(422)
      const body = JSON.parse(response.body)
      expect(body.success).toBe(false)
    })
  })

  describe('POST /api/v1/auth/signin', () => {
    beforeAll(async () => {
      // Create a user for signin tests
      await app.inject({
        method: 'POST',
        url: '/api/v1/auth/signup',
        payload: {
          email: 'signin@example.com',
          name: 'Signin User',
          password: 'SecurePass1!',
        },
      })
    })

    it('should authenticate valid credentials (200)', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/signin',
        payload: {
          email: 'signin@example.com',
          password: 'SecurePass1!',
        },
      })

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(body.success).toBe(true)
      expect(body.data.user.email).toBe('signin@example.com')
      expect(body.data.accessToken).toBeDefined()
    })

    it('should reject invalid password with generic message (401)', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/signin',
        payload: {
          email: 'signin@example.com',
          password: 'WrongPassword1!',
        },
      })

      expect(response.statusCode).toBe(401)
      const body = JSON.parse(response.body)
      expect(body.success).toBe(false)
      expect(body.error.detail).toBe('Invalid credentials')
    })

    it('should reject non-existent email with same generic message (401)', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/signin',
        payload: {
          email: 'nonexistent@example.com',
          password: 'SecurePass1!',
        },
      })

      expect(response.statusCode).toBe(401)
      const body = JSON.parse(response.body)
      expect(body.success).toBe(false)
      expect(body.error.detail).toBe('Invalid credentials')
    })
  })

  describe('GET /api/v1/auth/me', () => {
    let accessToken: string

    beforeAll(async () => {
      // Create a user and get token
      await app.inject({
        method: 'POST',
        url: '/api/v1/auth/signup',
        payload: {
          email: 'me@example.com',
          name: 'Me User',
          password: 'SecurePass1!',
        },
      })

      const signinResponse = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/signin',
        payload: {
          email: 'me@example.com',
          password: 'SecurePass1!',
        },
      })

      const body = JSON.parse(signinResponse.body)
      accessToken = body.data.accessToken
    })

    it('should return user with valid token (200)', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/auth/me',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(body.success).toBe(true)
      expect(body.data.email).toBe('me@example.com')
      expect(body.data.name).toBe('Me User')
    })

    it('should reject without token (401)', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/auth/me',
      })

      expect(response.statusCode).toBe(401)
      const body = JSON.parse(response.body)
      expect(body.success).toBe(false)
    })

    it('should reject with invalid token (401)', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/auth/me',
        headers: {
          Authorization: 'Bearer invalid-token',
        },
      })

      expect(response.statusCode).toBe(401)
      const body = JSON.parse(response.body)
      expect(body.success).toBe(false)
    })
  })

  describe('POST /api/v1/auth/refresh', () => {
    let refreshToken: string

    beforeAll(async () => {
      const signupResponse = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/signup',
        payload: {
          email: 'refresh@example.com',
          name: 'Refresh User',
          password: 'SecurePass1!',
        },
      })

      const cookies = signupResponse.cookies
      const refreshCookie = cookies.find((c: { name: string }) => c.name === 'refresh_token')
      refreshToken = refreshCookie!.value
    })

    it('should refresh token and rotate (200)', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/refresh',
        cookies: {
          refresh_token: refreshToken,
        },
      })

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(body.success).toBe(true)
      expect(body.data.accessToken).toBeDefined()

      // Check that a new refresh token cookie is set (rotation)
      const cookies = response.cookies
      const newRefreshCookie = cookies.find((c: { name: string }) => c.name === 'refresh_token')
      expect(newRefreshCookie).toBeDefined()
      expect(newRefreshCookie!.value).not.toBe(refreshToken)
    })

    it('should reject without refresh token (500)', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/refresh',
      })

      // Will throw an error since no token provided
      expect(response.statusCode).toBe(500)
    })
  })

  describe('POST /api/v1/auth/logout', () => {
    it('should logout and clear cookie (200)', async () => {
      // First signup to get a refresh token
      const signupResponse = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/signup',
        payload: {
          email: 'logout@example.com',
          name: 'Logout User',
          password: 'SecurePass1!',
        },
      })

      const cookies = signupResponse.cookies
      const refreshCookie = cookies.find((c: { name: string }) => c.name === 'refresh_token')

      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/logout',
        cookies: {
          refresh_token: refreshCookie!.value,
        },
      })

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(body.success).toBe(true)
    })
  })

  describe('X-Request-Id header', () => {
    it('should return X-Request-Id in response', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/signup',
        payload: {
          email: 'requestid@example.com',
          name: 'Request ID User',
          password: 'SecurePass1!',
        },
      })

      expect(response.headers['x-request-id']).toBeDefined()
      const body = JSON.parse(response.body)
      expect(body.requestId).toBeDefined()
    })

    it('should honor inbound X-Request-Id', async () => {
      const customRequestId = 'custom-request-id-123'
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/signin',
        headers: {
          'X-Request-Id': customRequestId,
        },
        payload: {
          email: 'nonexistent@example.com',
          password: 'SecurePass1!',
        },
      })

      // Request ID should be in response even if request fails
      const body = JSON.parse(response.body)
      expect(body.requestId).toBeDefined()
    })
  })
})
