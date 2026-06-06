import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type RefreshTokenDocument = HydratedDocument<RefreshToken>

@Schema({ timestamps: true })
export class RefreshToken {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  userId!: Types.ObjectId

  @Prop({
    required: true,
    index: true,
  })
  tokenHash!: string

  @Prop({
    required: true,
  })
  expiresAt!: Date

  @Prop({
    default: false,
  })
  revoked!: boolean
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken)

// TTL index for auto-cleanup of expired tokens
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
