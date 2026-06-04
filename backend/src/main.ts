import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { ValidationPipe, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import fastifyCookie from '@fastify/cookie'
import fastifyHelmet from '@fastify/helmet'
import fastifyCors from '@fastify/cors'
import { AppModule } from './app.module'
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor'
import { AllExceptionsFilter } from '@/common/filters/all-exceptions.filter'
import { RequestIdMiddleware } from '@/common/middleware/request-id.middleware'
import * as packageJson from '../package.json'

async function bootstrap() {
  const logger = new Logger('Bootstrap')

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())

  const config = app.get(ConfigService)

  // Extract major version from package.json for API prefix
  const majorVersion = packageJson.version.split('.')[0]
  const globalPrefix = `api/v${majorVersion}`
  app.setGlobalPrefix(globalPrefix)

  // Register Fastify plugins
  await app.register(fastifyHelmet, {
    contentSecurityPolicy: false,
  })

  await app.register(fastifyCors, {
    origin: config.get<string>('CORS_ORIGIN'),
    credentials: true,
  })

  await app.register(fastifyCookie, {
    secret: config.get<string>('COOKIE_SECRET'),
  })

  // Apply request ID middleware
  const requestIdMiddleware = new RequestIdMiddleware()
  app.use(requestIdMiddleware.use.bind(requestIdMiddleware))

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )

  // Global response interceptor and exception filter
  app.useGlobalInterceptors(new ResponseInterceptor())
  app.useGlobalFilters(new AllExceptionsFilter())

  // Swagger setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Easygenerator Auth API')
    .setDescription('Authentication API with JWT access tokens and rotating refresh tokens')
    .setVersion(packageJson.version)
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup(`${globalPrefix}/docs`, app, document)

  const port = config.get<number>('PORT') || 3000
  await app.listen(port, '0.0.0.0')

  logger.log(`Application is running on: http://localhost:${port}/${globalPrefix}`)
  logger.log(`Swagger docs available at: http://localhost:${port}/${globalPrefix}/docs`)
}

bootstrap()
