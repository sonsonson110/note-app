export interface JWTPayload {
  id: string
  username: string
  email: string | null
  sub: string
  iss: string
  iat: number
  exp: number
  passwordVersion: number
}
