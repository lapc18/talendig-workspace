import { FC } from 'react';
import { Card, Box, Typography, Chip, Stack, styled } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { IconTile } from '../IconTile';
import type { StatCardProps } from './StatCard.types';

const StyledCard = styled(Card)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
});

const ContentBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
});

const TrendChip = styled(Chip)<{ trend: 'up' | 'down' }>(({ theme, trend }) => ({
  height: 24,
  fontSize: 12,
  fontWeight: 500,
  backgroundColor: trend === 'up' ? '#dcfce7' : '#fee2e2',
  color: trend === 'up' ? '#15803d' : '#b91c1c',
  '& .MuiChip-label': {
    paddingLeft: 4,
    paddingRight: 4,
  },
}));

export const StatCard: FC<StatCardProps> = ({
  icon,
  label,
  value,
  trend,
  trendValue,
}) => {
  return (
    <StyledCard>
      <ContentBox>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <IconTile icon={icon} size="medium" />
          {trend && trendValue && (
            <TrendChip
              trend={trend}
              icon={
                trend === 'up' ? (
                  <TrendingUpIcon sx={{ fontSize: 14 }} />
                ) : (
                  <TrendingDownIcon sx={{ fontSize: 14 }} />
                )
              }
              label={`${trend === 'up' ? '+' : '-'}${trendValue}%`}
              size="small"
            />
          )}
        </Box>
        <Box>
          <Typography
            variant="caption"
            sx={{
              fontSize: 12,
              fontWeight: 500,
              color: (theme) =>
                theme.palette.mode === 'light' ? '#64748b' : '#94a3b8',
            }}
          >
            {label}
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontSize: 24,
              fontWeight: 700,
              fontFamily: 'Lexend, sans-serif',
              color: (theme) => theme.palette.text.primary,
              mt: 0.5,
            }}
          >
            {value}
          </Typography>
        </Box>
      </ContentBox>
    </StyledCard>
  );
};

export type { StatCardProps };

