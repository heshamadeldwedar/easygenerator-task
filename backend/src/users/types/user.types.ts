export interface CreateUserData {
  email: string
  name: string
  password: string
  permissions: string[]
}

export interface CreateUserDto {
  email: string
  name: string
  password: string
  permissions?: string[]
}
