export interface SignupFormData {
  username: string
  password: string
  email?: string
}

export interface SignupFormErrors {
  username?: string
  password?: string
  email?: string
  submit?: string
}
