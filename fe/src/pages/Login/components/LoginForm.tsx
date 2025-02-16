// components/LoginForm.tsx
import { Stack, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { FormEvent } from 'react'
import { LoginFormData, LoginFormErrors } from '../types'

interface LoginFormProps {
  formData: LoginFormData
  errors: LoginFormErrors
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function LoginForm({ formData, errors, onSubmit, onChange }: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} style={{ width: '100%' }}>
      <Stack spacing={2}>
        <TextField
          fullWidth
          error={!!errors.username}
          helperText={errors.username}
          name='username'
          label='Username'
          variant='outlined'
          value={formData.username}
          onChange={onChange}
          required
        />

        <TextField
          fullWidth
          error={!!errors.password}
          helperText={errors.password}
          type='password'
          name='password'
          label='Password'
          variant='outlined'
          value={formData.password}
          onChange={onChange}
          required
        />

        {errors.submit && (
          <Typography variant='body1' color='error'>
            {errors.submit}
          </Typography>
        )}

        <Button type='submit' variant='contained' fullWidth>
          Log In
        </Button>
      </Stack>
    </form>
  )
}
