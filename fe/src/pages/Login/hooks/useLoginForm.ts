// hooks/useLoginForm.ts
import { FormEvent, useState } from 'react'
import { LoginFormData, LoginFormErrors } from '../types'

export function useLoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: ''
  })
  const [errors, setErrors] = useState<LoginFormErrors>({})
  const [loading, setLoading] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.trim().length <= 6) {
      newErrors.username = 'Please enter a valid username'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length <= 6) {
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
        // Your API call here
        setTimeout(() => {
          setLoading(false)
        }, 3000)
      } catch (error) {
        setErrors({
          submit: error instanceof Error ? error.message : 'An error occurred'
        })
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