import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { validate } from '@/config/env.validation'
import { UsersModule } from '@/users/users.module'
import { AuthModule } from '@/auth/auth.module'
import { HealthModule } from '@/health/health.module'
import { LoggingInterceptor } from '@/common/interceptors/logging.interceptor'
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard'
import { PermissionsGuard } from '@/common/guards/permissions.guard'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
    }),
    UsersModule,
    AuthModule,
    HealthModule,
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
})
export class AppModule implements NestModule {
  configure(_consumer: MiddlewareConsumer) {
    // Request ID middleware is applied in main.ts via Fastify
  }
}
