import { FC } from 'react';
import { Chip, Box } from '@mui/material';
import { getStatusColor, getStatusLabel } from '../../utils/statusColors';
import type { StatusIndicatorProps } from './StatusIndicator.types';

export const StatusIndicator: FC<StatusIndicatorProps> = ({
  status,
  size = 'small',
  variant = 'chip',
  showLabel = true,
}) => {
  const color = getStatusColor(status);
  const label = getStatusLabel(status);

  if (variant === 'chip') {
    return (
      <Chip
        label={showLabel ? label : ''}
        color={color}
        size={size}
        sx={{
          fontWeight: 500,
        }}
      />
    );
  }

  if (variant === 'dot') {
    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: (theme) => {
              switch (status) {
                case 'active':
                  return theme.palette.success.main;
                case 'inactive':
                  return theme.palette.warning.main;
                case 'completed':
                  return theme.palette.info.main;
                case 'cancelled':
                  return theme.palette.error.main;
                default:
                  return theme.palette.grey[500];
              }
            },
          }}
        />
        {showLabel && (
          <Box component="span" sx={{ fontSize: '0.875rem' }}>
            {label}
          </Box>
        )}
      </Box>
    );
  }

  // badge variant
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        px: 1,
        py: 0.5,
        borderRadius: 1,
        backgroundColor: (theme) => {
          switch (status) {
            case 'active':
              return theme.palette.success.light;
            case 'inactive':
              return theme.palette.warning.light;
            case 'completed':
              return theme.palette.info.light;
            case 'cancelled':
              return theme.palette.error.light;
            default:
              return theme.palette.grey[300];
          }
        },
        color: (theme) => {
          switch (status) {
            case 'active':
              return theme.palette.success.dark;
            case 'inactive':
              return theme.palette.warning.dark;
            case 'completed':
              return theme.palette.info.dark;
            case 'cancelled':
              return theme.palette.error.dark;
            default:
              return theme.palette.text.primary;
          }
        },
        fontSize: '0.75rem',
        fontWeight: 500,
      }}
    >
      {showLabel ? label : ''}
    </Box>
  );
};

