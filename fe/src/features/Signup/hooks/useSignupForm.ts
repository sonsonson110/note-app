import { ChangeEvent, FormEvent, useState } from 'react'
import { SignupFormData, SignupFormErrors } from '../types'
import { useNavigate } from 'react-router-dom'
import { httpErrorHandler } from '../../../handlers/httpErrorHandler'
import { userApi } from '../../../services/user/userApi'
import { ApiError } from '../../../types/apiError'
import { VALIDATION } from '../constants'
import { SignupUserDto } from '../../../services/user/dto/signupUserDto'

export function useSignupForm() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState<SignupFormData>({
    username: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)

  const [errors, setErrors] = useState<SignupFormErrors>({})

  const validateForm = (): boolean => {
    const newErrors: SignupFormErrors = {}

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

    const emailRegrex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (formData.email && !emailRegrex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const setFieldError = (field: keyof SignupFormErrors) => (error: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: error
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validateForm()) {
      try {
        setLoading(true)
        const dto: SignupUserDto = {
          username: formData.username,
          password: formData.password,
          email: formData.email?.trim() ?? null
        }
        await userApi.signup(dto)
        navigate('/login')
      } catch (error: any) {
        if (error.response) {
          const { status, data } = error.response
          httpErrorHandler({
            statusCode: status,
            errorObject: data as ApiError,
            errorKeys: ['username', 'password', 'email'],
            setFieldErrors: {
              username: setFieldError('username'),
              password: setFieldError('password'),
              email: setFieldError('email')
            }
          })
          setErrors((pre) => ({ ...pre, submit: data.error.message }))
        }
      } finally {
        setLoading(false)
      }
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))

    if (errors[name as keyof SignupFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  return { formData, errors, loading, handleSubmit, handleChange }
}
