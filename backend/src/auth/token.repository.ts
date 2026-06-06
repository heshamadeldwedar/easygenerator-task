import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { RefreshToken, RefreshTokenDocument } from './schemas/refresh-token.schema'
import { CreateTokenData } from './types/token.types'

@Injectable()
export class TokenRepository {
  constructor(
    @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshTokenDocument>,
  ) {}

  async findValidToken(tokenHash: string): Promise<RefreshTokenDocument | null> {
    return this.refreshTokenModel
      .findOne({
        tokenHash,
        revoked: false,
        expiresAt: { $gt: new Date() },
      })
      .exec()
  }

  async revokeById(id: string): Promise<void> {
    await this.refreshTokenModel.updateOne({ _id: id }, { revoked: true }).exec()
  }

  async revokeByHash(tokenHash: string): Promise<void> {
    await this.refreshTokenModel.updateOne({ tokenHash }, { revoked: true }).exec()
  }

  async create(data: CreateTokenData): Promise<RefreshTokenDocument> {
    return this.refreshTokenModel.create({
      userId: data.userId,
      tokenHash: data.tokenHash,
      expiresAt: data.expiresAt,
      revoked: false,
    })
  }
}
