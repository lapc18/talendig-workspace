import { FC } from 'react';
import { CircularProgress, Box } from '@mui/material';
import type { LoadingSpinnerProps } from './LoadingSpinner.types';

export type { LoadingSpinnerProps };

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  size = 40,
  fullScreen = false,
  message,
}) => {
  const content = (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
      sx={fullScreen ? { minHeight: '100vh' } : { py: 4 }}
    >
      <CircularProgress size={size} />
      {message && <Box>{message}</Box>}
    </Box>
  );

  return content;
};

