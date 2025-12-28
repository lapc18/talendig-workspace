import type { ReactNode } from 'react';

export interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
}

export interface AppShellProps {
  children: ReactNode;
  navItems: NavItem[];
  activePath?: string;
  onNavClick?: (path: string) => void;
  title?: string;
  breadcrumbs?: Array<{ label: string; path?: string }>;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  notificationCount?: number;
  userAvatar?: string;
  userName?: string;
  userRole?: string;
  onHelpClick?: () => void;
  onNotificationClick?: () => void;
  onUserClick?: () => void;
  onSettingsClick?: () => void;
}

