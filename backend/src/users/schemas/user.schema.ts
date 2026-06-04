import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import * as bcrypt from 'bcrypt'

export type UserDocument = HydratedDocument<User>

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_doc, ret: Record<string, unknown>) => {
      ret.id = String(ret._id)
      delete ret._id
      delete ret.__v
      delete ret.password
      return ret
    },
  },
})
export class User {
  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  email!: string

  @Prop({
    required: true,
    minlength: 3,
    trim: true,
  })
  name!: string

  @Prop({
    required: true,
    select: false,
  })
  password!: string

  @Prop({
    type: [String],
    default: ['user:read:self'],
  })
  permissions!: string[]
}

export const UserSchema = SchemaFactory.createForClass(User)

// Pre-save hook to hash password when modified
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }

  try {
    const rounds = parseInt(process.env.BCRYPT_ROUNDS || '12', 10)
    this.password = await bcrypt.hash(this.password, rounds)
    next()
  } catch (error) {
    next(error as Error)
  }
})
