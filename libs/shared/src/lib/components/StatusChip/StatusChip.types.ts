export type StatusChipStatus = 'active' | 'inactive' | 'completed' | 'cancelled' | 'pending';

export interface StatusChipProps {
  status: StatusChipStatus;
  size?: 'small' | 'medium';
}

