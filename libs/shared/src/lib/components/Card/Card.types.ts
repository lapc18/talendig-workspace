import { ReactNode } from 'react';
import { CardProps as MuiCardProps } from '@mui/material';

export interface CardProps extends Omit<MuiCardProps, 'children'> {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  elevation?: number;
}

