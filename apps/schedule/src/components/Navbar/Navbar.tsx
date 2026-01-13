import { FC } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  useTheme,
  styled,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  height: 64,
  backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : '#0f172a',
  borderBottom: `1px solid ${
    theme.palette.mode === 'light' ? '#e2e8f0' : '#1f2937'
  }`,
  boxShadow: 'none',
  position: 'sticky',
  top: 0,
  zIndex: 50,
}));

const StyledToolbar = styled(Toolbar)({
  maxWidth: 1280, // max-w-7xl equivalent
  width: '100%',
  margin: '0 auto',
  padding: '0 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '100%',
});

const BrandBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  cursor: 'pointer',
  '&:hover': {
    '& .brand-icon': {
      transform: 'scale(1.05)',
    },
  },
}));

const BrandIcon = styled(Box)(({ theme }) => ({
  backgroundColor: '#1337ec',
  padding: 8,
  borderRadius: 8,
  color: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 1px 2px rgba(19, 55, 236, 0.30)',
  transition: 'transform 0.2s ease-in-out',
}));

const NavLinks = styled(Box)(({ theme }) => ({
  display: 'none',
  alignItems: 'center',
  gap: 24,
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const NavLink = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 600,
  color: theme.palette.mode === 'light' ? '#475569' : '#cbd5e1',
  cursor: 'pointer',
  transition: 'color 0.2s ease-in-out',
  '&:hover': {
    color: '#1337ec',
  },
}));

export const Navbar: FC = () => {
  const theme = useTheme();

  return (
    <StyledAppBar>
      <StyledToolbar>
        <BrandBox>
          <BrandIcon className="brand-icon">
            <SchoolIcon sx={{ fontSize: 20 }} />
          </BrandIcon>
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: 900,
              color: theme.palette.mode === 'light' ? '#100d1b' : '#ffffff',
              letterSpacing: '-0.02em',
            }}
          >
            Talendig
          </Typography>
        </BrandBox>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <NavLinks>
            <NavLink onClick={() => window.open('https://talendig.com', '_blank')}>
              About Us
            </NavLink>
          </NavLinks>
        </Box>
      </StyledToolbar>
    </StyledAppBar>
  );
};
