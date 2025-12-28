import { FC } from 'react';
import { Box, Typography } from '@mui/material';
import type { PageHeaderProps } from './PageHeader.types';

export type { PageHeaderProps };

export const PageHeader: FC<PageHeaderProps> = ({ title, subtitle, actions }) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
      mb={3}
      flexWrap="wrap"
      gap={2}
    >
      <Box>
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontSize: 30,
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            fontFamily: 'Lexend, sans-serif',
            color: (theme) => theme.palette.text.primary,
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="body1"
            sx={{
              fontSize: 14,
              fontWeight: 400,
              lineHeight: 1.5,
              fontFamily: 'Noto Sans, sans-serif',
              color: (theme) =>
                theme.palette.mode === 'light' ? '#64748b' : '#94a3b8',
              mt: 1,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions && <Box>{actions}</Box>}
    </Box>
  );
};

