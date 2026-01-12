import type { ReactNode } from 'react';

export type ProgramCardStatus = 'active' | 'inactive' | 'completed' | 'cancelled' | 'pending';

export interface ProgramCardProps {
  title: string;
  description: string;
  status: ProgramCardStatus;
  duration?: string;
  modulesCount?: number;
  studentsCount?: number;
  date?: string;
  icon?: ReactNode;
  onClick?: () => void;
  onMenuClick?: (event: React.MouseEvent) => void;
  onEditClick?: () => void;
}

