import { FC } from 'react';
import { Chip, styled } from '@mui/material';
import type { StatusChipProps } from './StatusChip.types';

const StyledChip = styled(Chip)<{ status: string; size: 'small' | 'medium' }>(
  ({ theme, status, size }) => {
    const statusColors = {
      active: {
        light: { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' },
        dark: {
          bg: 'rgba(34,197,94,0.18)',
          text: '#4ade80',
          border: 'rgba(34,197,94,0.25)',
        },
      },
      inactive: {
        light: { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
        dark: {
          bg: 'rgba(245,158,11,0.18)',
          text: '#fbbf24',
          border: 'rgba(245,158,11,0.25)',
        },
      },
      completed: {
        light: { bg: '#dbeafe', text: '#1d4ed8', border: '#bfdbfe' },
        dark: {
          bg: 'rgba(19,55,236,0.18)',
          text: '#93c5fd',
          border: 'rgba(19,55,236,0.25)',
        },
      },
      cancelled: {
        light: { bg: '#fee2e2', text: '#b91c1c', border: '#fecaca' },
        dark: {
          bg: 'rgba(239,68,68,0.18)',
          text: '#fca5a5',
          border: 'rgba(239,68,68,0.25)',
        },
      },
      pending: {
        light: { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
        dark: {
          bg: 'rgba(245,158,11,0.18)',
          text: '#fbbf24',
          border: 'rgba(245,158,11,0.25)',
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

const statusLabels: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
  completed: 'Completed',
  cancelled: 'Cancelled',
  pending: 'Pending',
};

export const StatusChip: FC<StatusChipProps> = ({ status, size = 'small' }) => {
  return (
    <StyledChip
      status={status}
      size={size}
      label={statusLabels[status] || status}
    />
  );
};

