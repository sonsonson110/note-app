import { Backdrop, Container, Link, Stack } from '@mui/material'
import Typography from '@mui/material/Typography'
import { LoginForm } from './components/LoginForm'
import { useLoginForm } from './hooks/useLoginForm'

export default function LoginPage() {
  const { formData, errors, loading, handleSubmit, handleChange } = useLoginForm()

  return (
    <Container maxWidth='xs'>
      <Backdrop sx={(theme) => ({ color: '#ffffff', zIndex: theme.zIndex.drawer + 1 })} open={loading}>
        <Typography variant='h5'>Logging you in...</Typography>
      </Backdrop>

      <Stack spacing={4} sx={{ mt: 5, alignItems: 'center' }}>
        <Typography variant='h3' sx={{ fontWeight: 450 }}>
          Note app
        </Typography>

        <LoginForm formData={formData} errors={errors} onSubmit={handleSubmit} onChange={handleChange} />

        <Typography variant='body1'>
          Don't have an account?{' '}
          <Link underline='none' component='button' onClick={() => {}} variant='body1'>
            Sign up
          </Link>
        </Typography>
      </Stack>
    </Container>
  )
}
