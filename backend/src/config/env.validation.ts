import { plainToInstance } from 'class-transformer'
import { IsString, IsNumber, IsIn, MinLength, validateSync } from 'class-validator'

export class EnvironmentVariables {
  @IsNumber()
  PORT: number = 3000

  @IsString()
  @IsIn(['development', 'production', 'test'])
  NODE_ENV: string = 'development'

  @IsString()
  MONGO_URI!: string

  @IsString()
  @MinLength(32)
  JWT_ACCESS_SECRET!: string

  @IsString()
  JWT_ACCESS_EXPIRY: string = '15m'

  @IsString()
  REFRESH_TOKEN_EXPIRY: string = '7d'

  @IsString()
  @MinLength(32)
  COOKIE_SECRET!: string

  @IsString()
  CORS_ORIGIN: string = 'http://localhost:5173'

  @IsNumber()
  BCRYPT_ROUNDS: number = 12
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  })

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  })

  if (errors.length > 0) {
    const errorMessages = errors.map((error) => {
      const constraints = error.constraints ? Object.values(error.constraints).join(', ') : ''
      return `${error.property}: ${constraints}`
    })
    throw new Error(`Environment validation failed:\n${errorMessages.join('\n')}`)
  }

  return validatedConfig
}
