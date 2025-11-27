import { FC } from 'react';
import { Button as MuiButton } from '@mui/material';
import type { ButtonProps } from './Button.types';

export type { ButtonProps };

export const Button: FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'contained',
  color = 'primary',
  disabled = false,
  fullWidth = false,
  size = 'medium',
  startIcon,
  endIcon,
  type = 'button',
  ...props
}) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      disabled={disabled}
      fullWidth={fullWidth}
      size={size}
      onClick={onClick}
      startIcon={startIcon}
      endIcon={endIcon}
      type={type}
      {...props}
    >
      {label}
    </MuiButton>
  );
};

