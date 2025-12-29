import type { ReactNode } from 'react';

export type StudentCardStatus = 'active' | 'inactive';

export interface StudentCardProps {
  title: string;
  subtitle: string;
  status: StudentCardStatus;
  cohort?: string;
  phone?: string;
  birthDate?: string;
  icon?: ReactNode;
  onClick?: () => void;
  onMenuClick?: (event: React.MouseEvent) => void;
  onCohortClick?: (event: React.MouseEvent) => void;
}

