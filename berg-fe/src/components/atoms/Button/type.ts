import type { ButtonProps } from "@mui/material/Button";

export type StyledButtonProps = ButtonProps & {
    buttonVariant?: 'primary' | 'secondary' | 'outlined'
}