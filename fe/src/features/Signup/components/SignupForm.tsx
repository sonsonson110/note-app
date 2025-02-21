import { Button, Stack, TextField, Typography } from '@mui/material'
import { FormEvent } from 'react'
import { SignupFormData, SignupFormErrors } from '../types'

interface SignupFormProps {
  formData: SignupFormData
  errors: SignupFormErrors
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function SignupForm({ formData, errors, onSubmit, onChange }: SignupFormProps) {
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

        <TextField
          fullWidth
          error={!!errors.email}
          helperText={errors.email}
          type='email'
          name='email'
          label='Email'
          variant='outlined'
          value={formData.email}
          onChange={onChange}
        />

        {errors.submit && (
          <Typography variant='body1' color='error'>
            {errors.submit}
          </Typography>
        )}

        <Button type='submit' variant='contained' fullWidth>
          Sign up
        </Button>
      </Stack>
    </form>
  )
}
