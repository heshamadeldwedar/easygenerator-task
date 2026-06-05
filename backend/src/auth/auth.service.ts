import { Injectable, UnauthorizedException } from '@nestjs/common'
import { FieldErrorException } from '@/common/exceptions/field-error.exception'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'
import { ulid } from 'ulid'
import { UsersService } from '@/users/users.service'
import { UserDocument } from '@/users/schemas/user.schema'
import { RefreshToken, RefreshTokenDocument } from './schemas/refresh-token.schema'
import { SignupDto } from './dto/signup.dto'
import { SigninDto } from './dto/signin.dto'
import { JwtPayload } from './types/jwt-payload.type'
import { DEFAULT_USER_PERMISSIONS } from '@/common/constants/permissions'
import { REFRESH_TOKEN_BYTES, REFRESH_COOKIE_MAX_AGE_MS } from '@/common/constants/auth.constants'

export interface UserDto {
  id: string
  email: string
  name: string
}

export interface AuthResult {
  user: UserDto
  accessToken: string
  refreshToken: string
}

export interface TokenResult {
  accessToken: string
  refreshToken: string
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshTokenDocument>,
  ) {}

  async signup(dto: SignupDto): Promise<AuthResult> {
    // Check if user exists
    const existing = await this.usersService.findByEmail(dto.email)
    if (existing) {
      throw FieldErrorException.conflict('email', 'Email already registered')
    }

    // Create user with default permissions
    const user = await this.usersService.create({
      email: dto.email,
      name: dto.name,
      password: dto.password,
      permissions: [...DEFAULT_USER_PERMISSIONS],
    })

    // Generate tokens
    const tokens = await this.generateTokens(user)

    return {
      user: this.toUserDto(user),
      ...tokens,
    }
  }

  async signin(dto: SigninDto): Promise<AuthResult> {
    // Find user with password
    const user = await this.usersService.findByEmailWithPassword(dto.email)
    if (!user) {
      // Generic message to prevent user enumeration
      throw new UnauthorizedException('Invalid credentials')
    }

    // Verify password
    const isValid = await bcrypt.compare(dto.password, user.password)
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // Generate tokens
    const tokens = await this.generateTokens(user)

    return {
      user: this.toUserDto(user),
      ...tokens,
    }
  }

  async refresh(oldToken: string): Promise<TokenResult> {
    // Hash the incoming token to compare
    const tokenHash = this.hashToken(oldToken)

    // Find the token record
    const tokenRecord = await this.refreshTokenModel.findOne({
      tokenHash,
      revoked: false,
      expiresAt: { $gt: new Date() },
    })

    if (!tokenRecord) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    // Check for token reuse (potential theft)
    // If this family has any revoked tokens with the same token, it's reuse
    const revokedInFamily = await this.refreshTokenModel.findOne({
      family: tokenRecord.family,
      revoked: true,
      _id: { $ne: tokenRecord._id },
    })

    if (revokedInFamily) {
      // Potential token theft detected - revoke all tokens in family
      await this.refreshTokenModel.updateMany({ family: tokenRecord.family }, { revoked: true })
      throw new UnauthorizedException('Token reuse detected')
    }

    // Revoke old token
    tokenRecord.revoked = true
    await tokenRecord.save()

    // Get user and generate new tokens (same family)
    const user = await this.usersService.findById(tokenRecord.userId.toString())
    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    return this.generateTokens(user, tokenRecord.family)
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenHash = this.hashToken(refreshToken)
    await this.refreshTokenModel.updateOne({ tokenHash }, { revoked: true })
  }

  async getUser(userId: string): Promise<UserDto> {
    const user = await this.usersService.findById(userId)
    if (!user) {
      throw new UnauthorizedException('User not found')
    }
    return this.toUserDto(user)
  }

  private async generateTokens(user: UserDocument, family?: string): Promise<TokenResult> {
    const payload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      permissions: user.permissions,
    }

    const accessToken = this.jwtService.sign(payload)

    // Generate opaque refresh token
    const refreshToken = crypto.randomBytes(REFRESH_TOKEN_BYTES).toString('hex')
    const tokenHash = this.hashToken(refreshToken)
    const tokenFamily = family || ulid()

    // Calculate expiry
    const expiryStr = this.configService.getOrThrow<string>('REFRESH_TOKEN_EXPIRY')
    const expiryMs = this.parseExpiry(expiryStr)
    const expiresAt = new Date(Date.now() + expiryMs)

    // Store hashed refresh token
    await this.refreshTokenModel.create({
      userId: user._id,
      tokenHash,
      expiresAt,
      family: tokenFamily,
      revoked: false,
    })

    return { accessToken, refreshToken }
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex')
  }

  private toUserDto(user: UserDocument): UserDto {
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    }
  }

  private parseExpiry(expiry: string): number {
    const match = expiry.match(/^(\d+)([smhd])$/)
    if (!match) {
      return REFRESH_COOKIE_MAX_AGE_MS
    }

    const value = parseInt(match[1], 10)
    const unit = match[2]

    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    }

    return value * multipliers[unit]
  }
}
