import { FC } from 'react';
import { Box, Typography, IconButton, Stack, styled } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { PaginationControlsProps } from './PaginationControls.types';

const StyledContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 0',
});

const StyledButton = styled(IconButton)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: 8, // lg radius
  border: `1px solid ${theme.palette.mode === 'light' ? '#e2e8f0' : '#334155'}`,
  color: theme.palette.mode === 'light' ? '#475569' : '#94a3b8',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'light' ? '#f8fafc' : '#1e293b',
    borderColor: theme.palette.mode === 'light' ? '#e2e8f0' : '#334155',
  },
  '&:disabled': {
    opacity: 0.5,
  },
}));

export const PaginationControls: FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <StyledContainer>
      <Typography
        variant="body2"
        sx={{
          fontSize: 14,
          color: (theme) =>
            theme.palette.mode === 'light' ? '#64748b' : '#94a3b8',
        }}
      >
        Showing {startItem}–{endItem} of {totalItems}
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        <StyledButton
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeftIcon sx={{ fontSize: 20 }} />
        </StyledButton>
        <StyledButton
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRightIcon sx={{ fontSize: 20 }} />
        </StyledButton>
      </Stack>
    </StyledContainer>
  );
};

export type { PaginationControlsProps };

