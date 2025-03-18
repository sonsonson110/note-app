export interface JWTPayload extends User {
  sub: string
  iss: string
  iat: number
  exp: number
  passwordVersion: number
}

export interface User {
  id: string
  username: string
  email: string | null
}