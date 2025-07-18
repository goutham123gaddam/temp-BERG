import TextField, { type TextFieldProps } from '@mui/material/TextField'
import { styled } from '@mui/material/styles'

const StyledTextField = styled(TextField)(() => ({
    
}))

export default function InputComponent({ ...props }: TextFieldProps) {
    return <StyledTextField {...props} />
}