import { FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { AppShell, type NavItem } from '@talendig/shared';
import { useAuth } from '@talendig/shared';
import type { MainLayoutProps } from './MainLayout.types';

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { label: 'Programs', path: '/programs', icon: <SchoolIcon /> },
  { label: 'Modules', path: '/modules', icon: <MenuBookIcon /> },
  { label: 'Students', path: '/students', icon: <PeopleIcon /> },
  { label: 'Instructors', path: '/instructors', icon: <PersonIcon /> },
  { label: 'Schedule', path: '/schedule', icon: <ScheduleIcon /> },
];

export const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  return (
    <AppShell
      navItems={navItems}
      activePath={location.pathname}
      onNavClick={handleNavClick}
      userName={user?.displayName || user?.email || 'User'}
      userRole={user?.role}
      onSettingsClick={() => navigate('/settings')}
      onUserClick={() => navigate('/profile')}
      >
        {children}
    </AppShell>
  );
};

