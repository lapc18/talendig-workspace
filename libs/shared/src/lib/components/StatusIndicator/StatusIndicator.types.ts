import type { Status } from '../../types/common.types';

export interface StatusIndicatorProps {
  status: Status;
  size?: 'small' | 'medium';
  variant?: 'chip' | 'dot' | 'badge';
  showLabel?: boolean;
}

