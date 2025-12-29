import type { ReactNode } from 'react';

export type SubjectCardStatus = 'active' | 'inactive';

export interface SubjectCardProps {
  title: string;
  subtitle: string;
  status: SubjectCardStatus;
  type?: string;
  defaultHours?: number;
  description?: string;
  programs?: string[];
  icon?: ReactNode;
  onClick?: () => void;
  onMenuClick?: (event: React.MouseEvent) => void;
  onProgramClick?: (event: React.MouseEvent, index: number) => void;
}

