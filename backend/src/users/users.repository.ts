import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from '@/users/schemas/user.schema'
import { CreateUserData } from '@/users/types/user.types'

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(data: CreateUserData): Promise<UserDocument> {
    const user = new this.userModel(data)
    return user.save()
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec()
  }

  async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).select('+password').exec()
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec()
  }
}
