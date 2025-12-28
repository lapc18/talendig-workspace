import { FC } from 'react';
import { Box, Typography, styled } from '@mui/material';
import type { SidebarNavItemProps } from './SidebarNavItem.types';

const StyledNavItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  height: 44,
  paddingLeft: 12,
  paddingRight: 12,
  borderRadius: theme.shape.borderRadius === 4 ? 8 : 8, // lg radius
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  backgroundColor: active
    ? theme.palette.mode === 'light'
      ? 'rgba(19, 55, 236, 0.10)'
      : 'rgba(19, 55, 236, 0.20)'
    : 'transparent',
  color: active
    ? '#1337ec'
    : theme.palette.mode === 'light'
      ? '#475569'
      : '#94a3b8',
  '&:hover': {
    backgroundColor: active
      ? theme.palette.mode === 'light'
        ? 'rgba(19, 55, 236, 0.10)'
        : 'rgba(19, 55, 236, 0.20)'
      : theme.palette.mode === 'light'
        ? '#f8fafc'
        : '#1e293b',
  },
  '& svg': {
    color: active
      ? '#1337ec'
      : theme.palette.mode === 'light'
        ? '#64748b'
        : '#64748b',
    fontSize: 20,
  },
}));

export const SidebarNavItem: FC<SidebarNavItemProps> = ({
  label,
  icon,
  active = false,
  onClick,
}) => {
  return (
    <StyledNavItem active={active} onClick={onClick}>
      {icon}
      <Typography
        variant="body2"
        sx={{
          fontWeight: active ? 500 : 400,
          fontSize: 14,
        }}
      >
        {label}
      </Typography>
    </StyledNavItem>
  );
};

export type { SidebarNavItemProps };

