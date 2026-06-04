import { IsEmail, IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SigninDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address',
  })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email!: string

  @ApiProperty({
    example: 'SecurePass1!',
    description: 'Password',
  })
  @IsString()
  @MinLength(1, { message: 'Password is required' })
  password!: string
}
