import type { ReactNode } from 'react';

export type ActivityStatus = 'active' | 'inactive' | 'completed' | 'cancelled' | 'pending';

export interface ActivityRowProps {
  icon: ReactNode;
  description: string;
  timestamp: string;
  status?: ActivityStatus;
}

