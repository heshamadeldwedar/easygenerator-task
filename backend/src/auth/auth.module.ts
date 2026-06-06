import { Module } from '@nestjs/common'
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigService } from '@nestjs/config'
import { UsersModule } from '@/users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { TokenRepository } from './token.repository'
import { JwtStrategy } from './strategies/jwt.strategy'
import { RefreshToken, RefreshTokenSchema } from './schemas/refresh-token.schema'

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => {
        const secret = config.get<string>('JWT_ACCESS_SECRET')
        if (!secret) {
          throw new Error('JWT_ACCESS_SECRET is not defined')
        }
        const expiresIn = config.getOrThrow<string>('JWT_ACCESS_EXPIRY')
        return {
          secret,
          signOptions: {
            expiresIn: expiresIn as `${number}${'s' | 'm' | 'h' | 'd'}`,
          },
        }
      },
    }),
    MongooseModule.forFeature([{ name: RefreshToken.name, schema: RefreshTokenSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenRepository, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
