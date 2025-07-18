import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import LoginBanner from '../../assets/login/loginBanner.jpg'
import LoginForm from '../organism/LoginForm/LoginForm'

export default function Login() {
    return (
        <Box display={'flex'}>
            <Box flex={1}>
                <img src={LoginBanner} alt="Login Banner" style={{ width: '100%', height: '100vh', objectFit: 'cover', borderRadius: '20px' }} />
            </Box>
            <Box flex={1} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'flex-start'}>
                <Box p={4} width={'100%'}>
                    <Typography variant="h5" style={{ color: '#744DCD' }}>Login to your account</Typography>
                    <LoginForm />
                </Box>
            </Box>
        </Box>
    )
}