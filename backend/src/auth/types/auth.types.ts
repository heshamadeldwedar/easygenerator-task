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
