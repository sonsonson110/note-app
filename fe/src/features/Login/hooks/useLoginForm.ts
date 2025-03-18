import { FormEvent, useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { httpErrorHandler } from '../../../handlers/httpErrorHandler'
import { ApiError } from '../../../types/apiError'
import { VALIDATION } from '../constants'
import { LoginFormData, LoginFormErrors } from '../types'

export function useLoginForm() {
  const { login } = useAuth()
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: ''
  })
  const [errors, setErrors] = useState<LoginFormErrors>({})
  const [loading, setLoading] = useState(false)

  const setFieldError = (field: keyof LoginFormErrors) => (error: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: error
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (
      formData.username.trim().length < VALIDATION.MIN_USERNAME_LENGTH ||
      formData.password.length > VALIDATION.MAX_USERNAME_LENGTH
    ) {
      newErrors.username = 'Please enter a valid username'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (
      formData.password.length < VALIDATION.MIN_PASSWORD_LENGTH ||
      formData.password.length > VALIDATION.MAX_PASSWORD_LENGTH
    ) {
      newErrors.password = 'Please enter a valid password'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validateForm()) {
      try {
        setLoading(true)
        await login({ username: formData.username, password: formData.password })
      } catch (error: any) {
        if (error.response) {
          const { status, data } = error.response
          httpErrorHandler({
            statusCode: status,
            errorObject: data as ApiError,
            errorKeys: ['username', 'password'],
            setFieldErrors: {
              username: setFieldError('username'),
              password: setFieldError('password')
            }
          })
          setErrors((pre) => ({ ...pre, submit: data.error.message }))
        }
      } finally {
        setLoading(false)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))

    if (errors[name as keyof LoginFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  return {
    formData,
    errors,
    loading,
    handleSubmit,
    handleChange
  }
}
