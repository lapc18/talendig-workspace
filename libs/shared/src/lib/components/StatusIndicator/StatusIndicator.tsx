import { FC } from 'react';
import { Chip, Box, styled } from '@mui/material';
import { getStatusLabel } from '../../utils/statusColors';
import type { StatusIndicatorProps } from './StatusIndicator.types';

const StyledChip = styled(Chip)<{ status: string; size: 'small' | 'medium' }>(
  ({ theme, status, size }) => {
    const statusColors = {
      active: {
        light: { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0', dot: '#22c55e' },
        dark: {
          bg: 'rgba(34,197,94,0.18)',
          text: '#4ade80',
          border: 'rgba(34,197,94,0.25)',
          dot: '#22c55e',
        },
      },
      inactive: {
        light: { bg: '#fef3c7', text: '#92400e', border: '#fde68a', dot: '#f59e0b' },
        dark: {
          bg: 'rgba(245,158,11,0.18)',
          text: '#fbbf24',
          border: 'rgba(245,158,11,0.25)',
          dot: '#f59e0b',
        },
      },
      completed: {
        light: { bg: '#dbeafe', text: '#1d4ed8', border: '#bfdbfe', dot: '#1337ec' },
        dark: {
          bg: 'rgba(19,55,236,0.18)',
          text: '#93c5fd',
          border: 'rgba(19,55,236,0.25)',
          dot: '#1337ec',
        },
      },
      cancelled: {
        light: { bg: '#fee2e2', text: '#b91c1c', border: '#fecaca', dot: '#ef4444' },
        dark: {
          bg: 'rgba(239,68,68,0.18)',
          text: '#fca5a5',
          border: 'rgba(239,68,68,0.25)',
          dot: '#ef4444',
        },
      },
      pending: {
        light: { bg: '#fef3c7', text: '#92400e', border: '#fde68a', dot: '#f59e0b' },
        dark: {
          bg: 'rgba(245,158,11,0.18)',
          text: '#fbbf24',
          border: 'rgba(245,158,11,0.25)',
          dot: '#f59e0b',
        },
      },
    };

    const colors =
      statusColors[status as keyof typeof statusColors]?.[
        theme.palette.mode
      ] || statusColors.active[theme.palette.mode];

    return {
      height: size === 'small' ? 24 : 28,
      borderRadius: 9999, // full
      paddingLeft: 10,
      paddingRight: 10,
      fontSize: size === 'small' ? 12 : 14,
      fontWeight: 500,
      fontFamily: 'Noto Sans, sans-serif',
      backgroundColor: colors.bg,
      color: colors.text,
      border: `1px solid ${colors.border}`,
      '& .MuiChip-label': {
        paddingLeft: 4,
        paddingRight: 4,
      },
    };
  }
);

export const StatusIndicator: FC<StatusIndicatorProps> = ({
  status,
  size = 'small',
  variant = 'chip',
  showLabel = true,
}) => {
  const label = getStatusLabel(status);

  if (variant === 'chip') {
    return (
      <StyledChip
        status={status}
        size={size}
        label={showLabel ? label : ''}
      />
    );
  }

  if (variant === 'dot') {
    const statusColors = {
      active: { light: '#22c55e', dark: '#22c55e' },
      inactive: { light: '#f59e0b', dark: '#f59e0b' },
      completed: { light: '#1337ec', dark: '#1337ec' },
      cancelled: { light: '#ef4444', dark: '#ef4444' },
      pending: { light: '#f59e0b', dark: '#f59e0b' },
    };

    const dotColor =
      statusColors[status as keyof typeof statusColors]?.[
        'light' // Use light for dot, or could be theme-aware
      ] || statusColors.active.light;

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
            backgroundColor: dotColor,
          }}
        />
        {showLabel && (
          <Box component="span" sx={{ fontSize: 14, fontFamily: 'Noto Sans, sans-serif' }}>
            {label}
          </Box>
        )}
      </Box>
    );
  }

  // badge variant - use same styling as chip
  return (
    <StyledChip
      status={status}
      size={size}
      label={showLabel ? label : ''}
    />
  );
};

