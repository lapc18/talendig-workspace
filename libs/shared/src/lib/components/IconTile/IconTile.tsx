import { FC } from 'react';
import { Box, styled } from '@mui/material';
import type { IconTileProps } from './IconTile.types';

const StyledIconTile = styled(Box)<{ size: 'small' | 'medium' | 'large' }>(
  ({ theme, size }) => {
    const sizeMap = {
      small: { padding: 8, iconSize: 16 },
      medium: { padding: 10, iconSize: 20 },
      large: { padding: 12, iconSize: 24 },
    };
    const { padding, iconSize } = sizeMap[size];

    return {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8, // lg radius
      padding,
      backgroundColor:
        theme.palette.mode === 'light'
          ? 'rgba(19, 55, 236, 0.10)'
          : 'rgba(19, 55, 236, 0.20)',
      color: '#1337ec',
      '& svg': {
        fontSize: iconSize,
      },
    };
  }
);

export const IconTile: FC<IconTileProps> = ({ icon, size = 'medium' }) => {
  return <StyledIconTile size={size}>{icon}</StyledIconTile>;
};

