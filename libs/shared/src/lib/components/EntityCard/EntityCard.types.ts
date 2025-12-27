import { ReactNode } from 'react';
import { CardProps as MuiCardProps } from '@mui/material';
import type { Status } from '../../types/common.types';

export interface EntityCardProps extends Omit<MuiCardProps, 'children'> {
  children?: ReactNode;
  title?: string;
  subtitle?: string;
  status?: Status;
  statusPosition?: 'left' | 'right' | 'top' | 'bottom';
  actions?: ReactNode;
  onClick?: () => void;
  elevation?: number;
}

