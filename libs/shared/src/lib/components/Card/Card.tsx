import { FC } from 'react';
import { Card as MuiCard, CardContent, CardHeader, CardActions } from '@mui/material';
import type { CardProps } from './Card.types';

export type { CardProps };

export const Card: FC<CardProps> = ({
  children,
  title,
  subtitle,
  actions,
  elevation = 1,
  ...props
}) => {
  return (
    <MuiCard elevation={elevation} {...props}>
      {(title || subtitle) && (
        <CardHeader title={title} subheader={subtitle} />
      )}
      <CardContent>{children}</CardContent>
      {actions && <CardActions>{actions}</CardActions>}
    </MuiCard>
  );
};

