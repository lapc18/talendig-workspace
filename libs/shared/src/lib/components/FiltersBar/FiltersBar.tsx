import { FC } from 'react';
import { Box, styled } from '@mui/material';
import type { FiltersBarProps } from './FiltersBar.types';

const StyledFiltersBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: 16,
  borderRadius: 12, // xl radius
  backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : '#0f172a',
  border: `1px solid ${theme.palette.mode === 'light' ? '#e2e8f0' : '#1f2937'}`,
  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06)', // sm shadow
}));

export const FiltersBar: FC<FiltersBarProps> = ({ children }) => {
  return <StyledFiltersBar>{children}</StyledFiltersBar>;
};

export type { FiltersBarProps };

