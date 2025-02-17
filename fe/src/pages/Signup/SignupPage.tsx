import { Container, Link, Stack, Typography } from '@mui/material'
import CustomBackdrop from '../../components/CustomBackdrop'
import SignupForm from './components/SignupForm'
import { useSignupForm } from './hooks/useSignupForm'
import { useNavigate } from 'react-router-dom'

export default function SignupPage() {
  const { formData, errors, loading, handleSubmit, handleChange } = useSignupForm()
  const navigate = useNavigate()
  const handleLoginNavigate = () => {
    navigate('/login')
  }

  return (
    <Container maxWidth='xs'>
      <CustomBackdrop text='Crafting your account...' open={loading} />

      <Stack spacing={4} sx={{ mt: 5, alignItems: 'center' }}>
        <Typography variant='h3' sx={{ fontWeight: 450 }}>
          Sign up
        </Typography>

        <SignupForm formData={formData} errors={errors} onSubmit={handleSubmit} onChange={handleChange} />

        <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          Already have an account?{' '}
          <Link  underline='none' component='button' onClick={handleLoginNavigate}>
            Log in
          </Link>
        </Typography>
      </Stack>
    </Container>
  )
}
