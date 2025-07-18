// import { Box, Typography, Avatar } from '@mui/material';
// import Header from '../Header/Header';
// import UserProfile from '../../molecules/Userprofile/UserProfile';

// const RightPane = () => {
//   const handleMenuClick = () => {
//     console.log('Menu clicked');
//   };

//   // Placeholder user data
//   const user = {
//     avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
//     name: 'Ray Edward',
//     role: 'Annotator',
//   };

//   const handleLogout = () => {
//     console.log('Logging out...');
//     // Add actual logout logic here
//   };
  
//   return (
//     <Box flex={1} display="flex" flexDirection="column">
//       {/* Top row: Search bar (left) and user profile (right) */}
//       <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" p={2}>
//         {/* Left: Search bar */}
//         <Box flex={1} maxWidth="60%">
//           {/* Replace with your actual SearchInput component */}
//           <Box bgcolor="#f8f9fb" borderRadius={2} px={2} py={1} display="flex" alignItems="center">
//             <span style={{ color: '#888', marginRight: 8 }}>&#128269;</span>
//             <Typography color="#888">Search here...</Typography>
//           </Box>
//         </Box>
//         {/* Right: User profile */}
//         <UserProfile
//           name={user.name}
//           role={user.role}
//           avatarUrl={user.avatarUrl}
//           onLogout={handleLogout}
//         />
//       </Box>
//       {/* Content in its own row */}
//       <Box
//         flex={1}
//         display="flex"
//         flexDirection="column"
//         justifyContent="center"
//         alignItems="center"
//         padding={4}
//       >
//         <Typography variant="h4" gutterBottom>
//           Dashboard
//         </Typography>
//         <Typography variant="body1">
//           Welcome to your main dashboard area.
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// export default RightPane;
