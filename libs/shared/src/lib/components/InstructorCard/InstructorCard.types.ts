import type { ReactNode } from 'react';

export type InstructorCardStatus = 'active' | 'inactive';

export interface InstructorCardProps {
  title: string;
  subtitle: string;
  status: InstructorCardStatus;
  phone?: string;
  bio?: string;
  technologies?: string[];
  subjects?: string[];
  modulesCount?: number;
  futureModulesCount?: number;
  cvUrl?: string;
  icon?: ReactNode;
  onClick?: () => void;
  onMenuClick?: (event: React.MouseEvent) => void;
}

