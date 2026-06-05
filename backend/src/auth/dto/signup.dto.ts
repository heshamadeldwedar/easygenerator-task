import { IsEmail, IsString, MinLength, Matches } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SignupDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Valid email address',
  })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email!: string

  @ApiProperty({
    example: 'John Doe',
    description: 'Name must be at least 3 characters',
    minLength: 3,
  })
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  name!: string

  @ApiProperty({
    example: 'SecurePass1!',
    description:
      'Password must be at least 8 characters with at least one letter, one number, and one special character',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/[a-zA-Z]/, { message: 'Password must contain at least one letter' })
  @Matches(/\d/, { message: 'Password must contain at least one number' })
  @Matches(/[!@#$%^&*(),.?":{}|<>_\-+=[\]\\;'`~]/, {
    message: 'Password must contain at least one special character',
  })
  password!: string
}
