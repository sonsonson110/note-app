import { Container, Link, Stack } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import CustomBackdrop from '../../components/CustomBackdrop'
import { LoginForm } from './components/LoginForm'
import { useLoginForm } from './hooks/useLoginForm'

export default function LoginPage() {
  const { formData, errors, loading, handleSubmit, handleChange } = useLoginForm()
  const navigate = useNavigate()

  const handleSignupNavigate = () => {
    navigate('/signup')
  }

  return (
    <Container maxWidth='xs'>
      <CustomBackdrop text='Sending you in...' open={loading} />

      <Stack spacing={4} sx={{ mt: 5, alignItems: 'center' }}>
        <Typography variant='h3' sx={{ fontWeight: 450 }}>
          Note app
        </Typography>

        <LoginForm formData={formData} errors={errors} onSubmit={handleSubmit} onChange={handleChange} />

        <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          Don't have an account?{' '}
          <Link underline='none' component='button' onClick={handleSignupNavigate}>
            Sign up
          </Link>
        </Typography>
      </Stack>
    </Container>
  )
}
