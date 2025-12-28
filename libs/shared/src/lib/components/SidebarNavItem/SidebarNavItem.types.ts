import type { ReactNode } from 'react';

export interface SidebarNavItemProps {
  label: string;
  icon: ReactNode;
  path: string;
  active?: boolean;
  onClick?: () => void;
}

