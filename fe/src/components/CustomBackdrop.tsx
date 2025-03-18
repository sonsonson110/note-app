import { Backdrop, Typography } from '@mui/material'

interface CustomBackdropProps {
  text: string,
  open: boolean
}

export default function CustomBackdrop({ text, open }: CustomBackdropProps) {
  return (
    <Backdrop sx={(theme) => ({ color: '#ffffff', zIndex: theme.zIndex.drawer + 1 })} open={open}>
      <Typography variant='h4' sx={{ fontWeight: 600 }}>
        {text}
      </Typography>
    </Backdrop>
  )
}
