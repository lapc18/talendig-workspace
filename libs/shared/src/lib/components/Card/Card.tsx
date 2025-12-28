import { FC } from 'react';
import { Card as MuiCard, CardContent, CardHeader, CardActions, styled } from '@mui/material';
import type { CardProps } from './Card.types';

const StyledCard = styled(MuiCard)(({ theme }) => ({
  borderRadius: 12, // xl radius
  backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : '#0f172a',
  border: `1px solid ${theme.palette.mode === 'light' ? '#e2e8f0' : '#1f2937'}`,
  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06)', // sm shadow
  padding: 20,
  '&:hover': {
    boxShadow: '0 6px 18px rgba(15, 23, 42, 0.10)', // md shadow
  },
}));

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
    <StyledCard elevation={elevation} {...props}>
      {(title || subtitle) && (
        <CardHeader title={title} subheader={subtitle} />
      )}
      <CardContent>{children}</CardContent>
      {actions && <CardActions>{actions}</CardActions>}
    </StyledCard>
  );
};

