import { FC } from 'react';
import { Box, Drawer, Typography, Avatar, styled } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import SettingsIcon from '@mui/icons-material/Settings';
import { SidebarNavItem } from '../SidebarNavItem';
import { Topbar } from '../Topbar';
import type { AppShellProps } from './AppShell.types';

const SIDEBAR_WIDTH = 256;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: SIDEBAR_WIDTH,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: SIDEBAR_WIDTH,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : '#101322',
    borderRight: `1px solid ${theme.palette.mode === 'light' ? '#e2e8f0' : '#1f2937'}`,
    display: 'flex',
    flexDirection: 'column',
  },
}));

const LogoSection = styled(Box)(({ theme }) => ({
  padding: 24,
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  borderBottom: `1px solid ${theme.palette.mode === 'light' ? '#e2e8f0' : '#1f2937'}`,
}));

const LogoIcon = styled(Box)({
  width: 32,
  height: 32,
  borderRadius: 8,
  backgroundColor: '#1337ec',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#ffffff',
  fontSize: 20,
  fontWeight: 700,
});

const NavSection = styled(Box)({
  flex: 1,
  padding: 12,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  overflowY: 'auto',
});

const BottomSection = styled(Box)(({ theme }) => ({
  padding: 12,
  borderTop: `1px solid ${theme.palette.mode === 'light' ? '#e2e8f0' : '#1f2937'}`,
}));

const UserProfileCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: 12,
  borderRadius: 8,
  backgroundColor: theme.palette.mode === 'light' ? '#f8fafc' : '#1e293b',
  marginBottom: 12,
}));

const SettingsButton = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: 12,
  borderRadius: 8,
  cursor: 'pointer',
  color: theme.palette.mode === 'light' ? '#475569' : '#94a3b8',
  transition: 'background-color 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'light' ? '#f8fafc' : '#1e293b',
  },
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  paddingTop: 64, // Topbar height
}));

export const AppShell: FC<AppShellProps> = ({
  children,
  navItems,
  activePath,
  onNavClick,
  title,
  breadcrumbs,
  searchValue,
  onSearchChange,
  notificationCount,
  userAvatar,
  userName = 'User',
  userRole,
  onHelpClick,
  onNotificationClick,
  onUserClick,
  onSettingsClick,
}) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <StyledDrawer variant="permanent" anchor="left">
        <LogoSection>
          <LogoIcon>
            <SchoolIcon sx={{ fontSize: 20 }} />
          </LogoIcon>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontSize: 18,
                fontWeight: 700,
                fontFamily: 'Lexend, sans-serif',
                color: (theme) => theme.palette.text.primary,
                lineHeight: 1.2,
              }}
            >
              Talendig
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontSize: 11,
                color: (theme) =>
                  theme.palette.mode === 'light' ? '#94a3b8' : '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 600,
              }}
            >
              Admin Dashboard
            </Typography>
          </Box>
        </LogoSection>

        <NavSection>
          {navItems.map((item) => (
            <SidebarNavItem
              key={item.path}
              label={item.label}
              icon={item.icon}
              path={item.path}
              active={activePath === item.path}
              onClick={() => onNavClick?.(item.path)}
            />
          ))}
        </NavSection>

        <BottomSection>
          {onSettingsClick && (
            <SettingsButton onClick={onSettingsClick}>
              <SettingsIcon sx={{ fontSize: 20 }} />
              <Typography
                variant="body2"
                sx={{
                  fontSize: 14,
                  fontWeight: 400,
                }}
              >
                Settings
              </Typography>
            </SettingsButton>
          )}
          <UserProfileCard>
            <Avatar
              src={userAvatar}
              sx={{
                width: 40,
                height: 40,
                bgcolor: '#1337ec',
              }}
            >
              {userName.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: (theme) => theme.palette.text.primary,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {userName}
              </Typography>
              {userRole && (
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: 12,
                    color: (theme) =>
                      theme.palette.mode === 'light' ? '#64748b' : '#94a3b8',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {userRole}
                </Typography>
              )}
            </Box>
          </UserProfileCard>
        </BottomSection>
      </StyledDrawer>

      <MainContent>
        <Topbar
          title={title}
          breadcrumbs={breadcrumbs}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          notificationCount={notificationCount}
          userAvatar={userAvatar}
          userName={userName}
          userRole={userRole}
          onHelpClick={onHelpClick}
          onNotificationClick={onNotificationClick}
          onUserClick={onUserClick}
        />
        <Box sx={{ padding: 3 }}>{children}</Box>
      </MainContent>
    </Box>
  );
};

export type { AppShellProps };

