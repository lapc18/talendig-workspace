import { FC } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Badge,
  Stack,
  styled,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { TopbarProps } from './Topbar.types';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  height: 64,
  backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : '#101322',
  borderBottom: `1px solid ${theme.palette.mode === 'light' ? '#e2e8f0' : '#1f2937'}`,
  boxShadow: 'none',
  color: theme.palette.text.primary,
}));

const StyledToolbar = styled(Toolbar)({
  height: 64,
  paddingLeft: 24,
  paddingRight: 24,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const StyledSearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    height: 40,
    width: 320,
    backgroundColor: theme.palette.mode === 'light' ? '#f1f5f9' : '#1f2937',
    '& fieldset': {
      border: 'none',
    },
    '&:hover': {
      backgroundColor: theme.palette.mode === 'light' ? '#f1f5f9' : '#1f2937',
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.mode === 'light' ? '#f1f5f9' : '#1f2937',
    },
  },
}));

export const Topbar: FC<TopbarProps> = ({
  title,
  breadcrumbs,
  searchValue = '',
  onSearchChange,
  notificationCount = 0,
  userAvatar,
  userName = 'User',
  userRole,
  onHelpClick,
  onNotificationClick,
  onUserClick,
}) => {
  return (
    <StyledAppBar position="fixed">
      <StyledToolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flex: 1 }}>
          {breadcrumbs && breadcrumbs.length > 0 ? (
            <Stack direction="row" spacing={1} alignItems="center">
              {breadcrumbs.map((crumb, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {index > 0 && (
                    <ChevronRightIcon
                      sx={{
                        fontSize: 16,
                        color: (theme) =>
                          theme.palette.mode === 'light' ? '#64748b' : '#94a3b8',
                      }}
                    />
                  )}
                  <Typography
                    variant="body2"
                    sx={{
                      color: (theme) =>
                        index === breadcrumbs.length - 1
                          ? theme.palette.mode === 'light'
                            ? '#0f172a'
                            : '#ffffff'
                          : theme.palette.mode === 'light'
                            ? '#64748b'
                            : '#94a3b8',
                      fontWeight: index === breadcrumbs.length - 1 ? 500 : 400,
                    }}
                  >
                    {crumb.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          ) : (
            title && (
              <Typography
                variant="h1"
                sx={{
                  fontSize: 30,
                  fontWeight: 700,
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  fontFamily: 'Lexend, sans-serif',
                }}
              >
                {title}
              </Typography>
            )
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {onSearchChange && (
            <StyledSearchField
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                onSearchChange(target.value);
              }}
              InputProps={{
                startAdornment: (
                  <SearchIcon
                    sx={{
                      fontSize: 20,
                      color: (theme) =>
                        theme.palette.mode === 'light' ? '#64748b' : '#94a3b8',
                      mr: 1,
                    }}
                  />
                ),
              }}
              size="small"
            />
          )}

          {onHelpClick && (
            <IconButton onClick={onHelpClick} size="small">
              <HelpOutlineIcon
                sx={{
                  fontSize: 20,
                  color: (theme) =>
                    theme.palette.mode === 'light' ? '#64748b' : '#94a3b8',
                }}
              />
            </IconButton>
          )}

          {onNotificationClick && (
            <IconButton onClick={onNotificationClick} size="small">
              <Badge badgeContent={notificationCount} color="error">
                <NotificationsIcon
                  sx={{
                    fontSize: 20,
                    color: (theme) =>
                      theme.palette.mode === 'light' ? '#64748b' : '#94a3b8',
                  }}
                />
              </Badge>
            </IconButton>
          )}

          {onUserClick && (
            <IconButton onClick={onUserClick} size="small" sx={{ ml: 1 }}>
              <Avatar
                src={userAvatar}
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: '#1337ec',
                }}
              >
                {userName.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          )}
        </Box>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export type { TopbarProps };

