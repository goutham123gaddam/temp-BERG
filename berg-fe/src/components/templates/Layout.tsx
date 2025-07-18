import Box from '@mui/material/Box'
import { Outlet } from 'react-router-dom'
import LeftPanel from '../organism/LeftPanel/LeftPanel'
import Header from '../organism/Header/Header'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { Typography} from '@mui/material';
export default function Layout() {
  return (
    <Box minHeight="100vh" display="flex" bgcolor="#F7F7F7" p={3} gap={2}>
      <Box flex={1}>
        <LeftPanel />
      </Box>
      <Box flex={4}>
        <Box minHeight={'100vh'} sx={{ background: '#FFFFFF', borderRadius: '20px' }} display={'flex'} flexDirection={'column'} gap={3}>
          <Header onSearch={() => { }} onMenuClick={() => { }} />
          <Box px={4}>  
            
            <Breadcrumbs aria-label="breadcrumb">
      <Link underline="hover" color="inherit" href="/">
        Home
      </Link>
      <Link underline="hover" color="inherit" href="/projects">
        Projects
      </Link>
      <Typography color="text.primary">Project Details</Typography>
    </Breadcrumbs></Box>
          <Box px={4}>
            <Outlet />
          </Box>
          {/* kamal2 */}
        </Box>
      </Box>
    </Box>
  )
}