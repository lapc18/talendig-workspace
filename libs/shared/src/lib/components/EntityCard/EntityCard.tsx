import { FC } from 'react';
import { Card, CardContent, CardHeader, CardActions, Box, Typography } from '@mui/material';
import { StatusIndicator } from '../StatusIndicator';
import type { EntityCardProps } from './EntityCard.types';

export const EntityCard: FC<EntityCardProps> = ({
  children,
  title,
  subtitle,
  status,
  statusPosition = 'right',
  actions,
  onClick,
  elevation = 1,
  sx,
  ...props
}) => {
  const cardSx = {
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 0.2s ease-in-out',
    '&:hover': onClick
      ? {
          elevation: elevation + 2,
          transform: 'translateY(-2px)',
        }
      : {},
    ...sx,
  };

  const renderStatus = () => {
    if (!status) return null;
    return <StatusIndicator status={status} variant="chip" size="small" />;
  };

  const renderHeader = () => {
    if (!title && !subtitle && !status) return null;

    const statusElement = renderStatus();
    const showStatusInHeader = statusPosition === 'top' || statusPosition === 'bottom';

    return (
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between' }}>
            <Typography variant="h6" component="div">
              {title}
            </Typography>
            {showStatusInHeader && statusPosition === 'top' && statusElement}
          </Box>
        }
        subheader={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between', mt: 0.5 }}>
            {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
            {showStatusInHeader && statusPosition === 'bottom' && statusElement}
          </Box>
        }
      />
    );
  };

  return (
    <Card elevation={elevation} onClick={onClick} sx={cardSx} {...props}>
      {renderHeader()}
      <CardContent>
        {!title && status && (statusPosition === 'left' || statusPosition === 'right') && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 2,
              mb: children ? 2 : 0,
            }}
          >
            {statusPosition === 'left' && <Box>{renderStatus()}</Box>}
            <Box sx={{ flex: 1 }}>{children}</Box>
            {statusPosition === 'right' && <Box>{renderStatus()}</Box>}
          </Box>
        )}
        {(!status || statusPosition === 'top' || statusPosition === 'bottom') && children}
        {title && status && (statusPosition === 'left' || statusPosition === 'right') && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 2,
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ flex: 1 }}>{children}</Box>
            {statusPosition === 'right' && <Box>{renderStatus()}</Box>}
          </Box>
        )}
      </CardContent>
      {actions && <CardActions>{actions}</CardActions>}
    </Card>
  );
};

