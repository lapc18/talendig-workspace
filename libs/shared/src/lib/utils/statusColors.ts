import type { Status } from '../types/common.types';

/**
 * Get the color name for a status (for use with MUI theme colors)
 */
export const getStatusColor = (status: Status): 'success' | 'warning' | 'error' | 'info' => {
  switch (status) {
    case 'active':
      return 'success'; // green
    case 'inactive':
      return 'warning'; // yellow
    case 'completed':
      return 'info'; // blue
    case 'cancelled':
      return 'error'; // red
    default:
      return 'success';
  }
};

/**
 * Get the MUI Chip color prop value for a status
 */
export const getStatusChipColor = (status: Status): 'success' | 'warning' | 'error' | 'info' | 'default' => {
  return getStatusColor(status);
};

/**
 * Get a human-readable label for a status
 */
export const getStatusLabel = (status: Status): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

