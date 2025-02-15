export interface LoginFormData {
  username: string
  password: string
}

export interface LoginFormErrors {
  username?: string
  password?: string
  submit?: string
}