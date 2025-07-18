// src/components/molecules/ProgressCircle/ProgressCircle.tsx

import { Box, CircularProgress, Typography } from '@mui/material';

type Props = {
  value: number;
};

const ProgressCircle = ({ value }: Props) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" value={value} sx={{color:'#744DCD'}}/>
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${value}%`}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProgressCircle;
