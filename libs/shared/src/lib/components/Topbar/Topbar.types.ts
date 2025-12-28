import type { ReactNode } from 'react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface TopbarProps {
  title?: string;
  breadcrumbs?: BreadcrumbItem[];
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  notificationCount?: number;
  userAvatar?: string;
  userName?: string;
  userRole?: string;
  onHelpClick?: () => void;
  onNotificationClick?: () => void;
  onUserClick?: () => void;
}

