import { FC } from 'react';
import { Box, Typography, Stack, styled } from '@mui/material';
import { StatusChip } from '../StatusChip';
import type { ActivityRowProps } from './ActivityRow.types';

const StyledRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: 12,
  borderRadius: 8,
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'light' ? '#f8fafc' : '#1e293b',
  },
}));

const IconBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  borderRadius: 8,
  backgroundColor:
    theme.palette.mode === 'light'
      ? 'rgba(19, 55, 236, 0.10)'
      : 'rgba(19, 55, 236, 0.20)',
  color: '#1337ec',
  '& svg': {
    fontSize: 18,
  },
}));

const ContentBox = styled(Box)({
  flex: 1,
  minWidth: 0,
});

export const ActivityRow: FC<ActivityRowProps> = ({
  icon,
  description,
  timestamp,
  status,
}) => {
  return (
    <StyledRow>
      <IconBox>{icon}</IconBox>
      <ContentBox>
        <Typography
          variant="body2"
          sx={{
            fontSize: 14,
            fontWeight: 400,
            color: (theme) => theme.palette.text.primary,
            mb: 0.5,
          }}
        >
          {description}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontSize: 12,
            color: (theme) =>
              theme.palette.mode === 'light' ? '#64748b' : '#94a3b8',
          }}
        >
          {timestamp}
        </Typography>
      </ContentBox>
      {status && <StatusChip status={status} />}
    </StyledRow>
  );
};

export type { ActivityRowProps };

