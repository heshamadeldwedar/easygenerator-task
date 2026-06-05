import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import { UsersRepository } from '@/users/users.repository'
import { UserDocument } from '@/users/schemas/user.schema'
import { CreateUserDto } from '@/users/types/user.types'

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private configService: ConfigService,
  ) {}

  async create(dto: CreateUserDto): Promise<UserDocument> {
    const rounds = this.configService.get<number>('BCRYPT_ROUNDS', 12)
    const hashedPassword = await bcrypt.hash(dto.password, rounds)

    return this.usersRepository.create({
      email: dto.email,
      name: dto.name,
      password: hashedPassword,
      permissions: dto.permissions ?? [],
    })
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.usersRepository.findByEmail(email)
  }

  async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return this.usersRepository.findByEmailWithPassword(email)
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.usersRepository.findById(id)
  }
}
