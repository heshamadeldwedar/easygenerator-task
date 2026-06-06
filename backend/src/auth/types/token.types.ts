import { Types } from 'mongoose'

export interface CreateTokenData {
  userId: Types.ObjectId
  tokenHash: string
  expiresAt: Date
}
