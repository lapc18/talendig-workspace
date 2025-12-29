import type { ReactNode } from 'react';

export type ModuleCardStatus = 'active' | 'inactive';

export interface ModuleCardProps {
  title: string;
  subtitle?: string;
  status: ModuleCardStatus;
  program?: string;
  instructor?: string;
  subject?: string;
  hours?: number;
  startDate?: string;
  endDate?: string;
  date?: string;
  icon?: ReactNode;
  onClick?: () => void;
  onMenuClick?: (event: React.MouseEvent) => void;
  onProgramClick?: (event: React.MouseEvent) => void;
}

