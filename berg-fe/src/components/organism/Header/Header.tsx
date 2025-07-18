import Box from '@mui/material/Box';
import React from 'react';
import SearchInput from '../../molecules/SearchInput/SearchInput';
import UserProfile from '../../molecules/Userprofile/UserProfile';

type AppHeaderProps = {
  onMenuClick: () => void;
  onSearch: (value: string) => void;
};

const Header: React.FC<AppHeaderProps> = (props) => {
   

     const userDataString = localStorage.getItem('user');
     const userData = userDataString ? JSON.parse(userDataString) : null;

    const role = userData?.user?.email;
    console.log("0000---->",role)
    const name = userData?.user?.user_metadata?.name || role?.split('@')[0];

 
  return (
    <Box px={4} py={2} display='flex' gap={2} borderBottom='1px solid #F0F2F5'>
      <SearchInput onSearch={props.onSearch} placeholder='Search here....' sx={{ background: '#F7F9FC', flex: 1 }} />
      
      <Box flex={1} display='flex' justifyContent='flex-end' alignItems='center' gap={2}>
        <UserProfile name={name} role={role} avatarUrl='https://via.placeholder.com/150'   />
      </Box>
    </Box>
  )
}
// <AppBar
//   position="fixed"
//   sx={{
//     width: { sm: `calc(100% - 240px)` },
//     ml: { sm: `240px` },
//   }}
// >
//   <Toolbar>
//     <IconButton
//       color="inherit"
//       aria-label="open drawer"
//       edge="start"
//       onClick={onMenuClick}
//       sx={{ mr: 2, display: { sm: 'none' } }}
//     >
//       ☰
//     </IconButton>
//     <Typography variant="h6" noWrap component="div">
//       Responsive Drawer
//     </Typography>
//   </Toolbar>
// </AppBar>



export default Header;
