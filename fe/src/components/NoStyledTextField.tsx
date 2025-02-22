import { Box, InputBase, InputBaseProps, SvgIconProps, SxProps, Theme } from '@mui/material'
import { ElementType } from 'react'

interface NoStyledTextFieldProps extends Omit<InputBaseProps, 'onChange'> {
  containerSx?: SxProps<Theme> 
  leadingIcon?: ElementType<SvgIconProps>
  onValueChange: (newValue: string) => void
}

export default function NoStyledTextField({
  value,
  onValueChange,
  containerSx,
  leadingIcon: LeadingIcon,
  ...rest
}: NoStyledTextFieldProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ...containerSx }}>
      {LeadingIcon && (
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
          <LeadingIcon color='primary' />
        </Box>
      )}
      <InputBase
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        fullWidth
        {...rest}
      />
    </Box>
  )
}
