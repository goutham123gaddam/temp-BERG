import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import type { StyledButtonProps } from './type'



const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'buttonVariant'
})<StyledButtonProps>(({ buttonVariant = 'primary' }) => ({
  
  ...(buttonVariant === 'primary' && {
    backgroundColor: 'var(--primary-color)',
    color: '#ffffff',
    border: 'none',
    // boxShadow: '0 4px 14px rgba(116, 77, 205, 0.25)',
    
    '&:hover': {
      backgroundColor: 'var(--primary-hover)',
      // boxShadow: '0 6px 20px rgba(116, 77, 205, 0.35), 0 2px 8px rgba(0, 0, 0, 0.1)',
      transform: 'translateY(-2px)',
    },
    
    '&:active': {
      backgroundColor: 'var(--primary-active)',
      transform: 'translateY(0)',
      // boxShadow: '0 2px 8px rgba(116, 77, 205, 0.25)',
    },
    
    '&:disabled': {
      backgroundColor: '#9ca3af',
      color: '#ffffff',
      boxShadow: 'none',
      transform: 'none',
      cursor: 'not-allowed',
    },
  }),
  
  ...(buttonVariant === 'secondary' && {
    backgroundColor: '#ffffff',
    color: '#6b7280',
    border: '2px solid #e1e5e9',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    
    '&:hover': {
      backgroundColor: '#f9fafb',
      borderColor: '#c1c7cd',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      transform: 'translateY(-1px)',
    },
    
    '&:active': {
      backgroundColor: '#f3f4f6',
      transform: 'translateY(0)',
    },
    
    '&:disabled': {
      backgroundColor: '#f9fafb',
      color: '#9ca3af',
      borderColor: '#e5e7eb',
      boxShadow: 'none',
      transform: 'none',
      cursor: 'not-allowed',
    },
  }),
  
  ...(buttonVariant === 'outlined' && {
    backgroundColor: 'transparent',
    color: 'var(--primary-color)',
    border: '2px solid var(--primary-color)',
    boxShadow: '0 2px 4px rgba(116, 77, 205, 0.1)',
    
    '&:hover': {
      backgroundColor: 'var(--primary-color)',
      color: '#ffffff',
      boxShadow: '0 4px 12px rgba(116, 77, 205, 0.2)',
      transform: 'translateY(-1px)',
    },
    
    '&:active': {
      backgroundColor: 'var(--primary-hover)',
      borderColor: 'var(--primary-hover)',
      transform: 'translateY(0)',
    },
    
    '&:disabled': {
      backgroundColor: 'transparent',
      color: '#9ca3af',
      borderColor: '#e5e7eb',
      boxShadow: 'none',
      transform: 'none',
      cursor: 'not-allowed',
    },
  }),
}))

export default function ButtonComponent({ 
  children, 
  buttonVariant = 'primary',
  ...props 
}: StyledButtonProps) {
    return <StyledButton buttonVariant={buttonVariant} {...props}>{children}</StyledButton>
}