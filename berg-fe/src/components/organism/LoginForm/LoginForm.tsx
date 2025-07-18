import Box from '@mui/material/Box'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { object, string } from 'yup'
import type { ObjectSchema } from 'yup'
import { useEffect } from 'react'
import InputComponent from '../../atoms/Input/Input'
import ButtonComponent from '../../atoms/Button/Button'
import type { LoginFormData } from './type'
import { useAuth } from '../../../hooks/useAuth'
import { useSnackbar } from '../../../hooks/useSnackbar'
import { ROUTES_FRONTEND } from '../../../constant'
import { useNavigate } from 'react-router-dom'

// Validation schema
const loginSchema: ObjectSchema<LoginFormData> = object({
  email: string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: string()
    .required('Password is required'),
})

export default function LoginForm() {
    const { loginUser, loading, error: loginError, clearAuthError } = useAuth()
    const { success, error: showError } = useSnackbar()
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm<LoginFormData>({
        resolver: yupResolver(loginSchema),
        mode: 'onChange'
    })

    // Watch form values to clear error when user starts typing
    const watchedValues = watch()

    // Clear error when user starts typing
    useEffect(() => {
        if (loginError && (watchedValues.email || watchedValues.password)) {
            clearAuthError();
        }
    }, [watchedValues.email, watchedValues.password, loginError, clearAuthError])

    console.log('loginError', loginError)
    const onSubmit = async (data: LoginFormData) => {
        try {
            const result = await loginUser(data.email, data.password)
            console.log('result',result)
            // Check if the action was fulfilled (successful)
            if (result.meta.requestStatus === 'fulfilled') {
                reset()
                success('Login successful!')
                 
                navigate(ROUTES_FRONTEND.HOME)
            } else if (result.meta.requestStatus === 'rejected') {
                // Show error message to user
                showError(loginError || 'Login failed. Please try again.')
            }
            // If rejected, the error will be available in loginError state
        } catch (error) {
            console.log('error', error)
            showError(loginError || 'Login failed. Please try again.')
        }
    }

    return (
        <Box 
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            display={'flex'} 
            flexDirection={'column'} 
            gap={2} 
            mt={2}
        >
            <InputComponent 
                label="Email" 
                type="email"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{width: '100%', borderRadius: '10px'}}
            />
            <InputComponent 
                label="Password" 
                type="password"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={{width: '100%', borderRadius: '10px'}}
            />
            <ButtonComponent 
                buttonVariant="primary" 
                type="submit"
                disabled={loading}
            >
                {loading ? 'Logging in...' : 'Login'}
            </ButtonComponent>
        </Box>
    )
}