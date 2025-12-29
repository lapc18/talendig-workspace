import type { ReactNode } from 'react';

export type CohortCardStatus = 'active' | 'inactive' | 'completed';

export interface CohortCardProps {
  title: string;
  subtitle?: string;
  status: CohortCardStatus;
  program?: string;
  studentsCount?: number;
  startDate?: string;
  endDate?: string;
  date?: string;
  icon?: ReactNode;
  onClick?: () => void;
  onMenuClick?: (event: React.MouseEvent) => void;
  onProgramClick?: (event: React.MouseEvent) => void;
}

