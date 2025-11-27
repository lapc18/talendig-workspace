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
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" mt={1}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions && <Box>{actions}</Box>}
    </Box>
  );
};

