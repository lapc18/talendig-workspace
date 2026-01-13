import { FC } from 'react';
import {
  Card,
  Box,
  Typography,
  Avatar,
  useTheme,
  styled,
} from '@mui/material';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import type { ScheduleCohortCardProps } from './ScheduleCohortCard.types';

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : '#0f172a',
  border: `1px solid ${theme.palette.mode === 'light' ? '#e2e8f0' : '#1f2937'}`,
  borderRadius: 12,
  padding: 24,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 24,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-lg
  },
}));

const MainContent = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 20, // space-y-5
  width: '100%',
});

const HeaderRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: 12,
});

const TitleRow = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 12,
});

const MonthBadge = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '4px 10px',
  backgroundColor: theme.palette.mode === 'light' ? 'rgba(19, 55, 236, 0.1)' : 'rgba(19, 55, 236, 0.2)',
  color: '#1337ec',
  fontSize: 10,
  fontWeight: 900,
  textTransform: 'uppercase',
  borderRadius: 9999,
  letterSpacing: '0.08em',
  flexShrink: 0,
}));

const InfoRow = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 32,
  gapY: 12,
});

const InfoItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});

const InstructorAvatar = styled(Avatar)(({ theme }) => ({
  width: 36,
  height: 36,
  border: `2px solid ${theme.palette.mode === 'light' ? '#ffffff' : '#0f172a'}`,
  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06)',
  flexShrink: 0,
  backgroundColor: theme.palette.mode === 'light' ? '#f1f5f9' : '#1f2937',
}));

const InfoLabel = styled(Typography)(({ theme }) => ({
  fontSize: 10,
  fontWeight: 700,
  textTransform: 'uppercase',
  color: theme.palette.mode === 'light' ? '#94a3b8' : '#64748b',
  lineHeight: 1,
  marginBottom: 4,
}));

const InfoValue = styled(Typography)<{ isToBeAssigned?: boolean }>(({ theme, isToBeAssigned }) => ({
  fontSize: 14,
  fontWeight: 700,
  color: isToBeAssigned
    ? '#d97706' // amber-600
    : theme.palette.mode === 'light'
    ? '#1e293b'
    : '#e2e8f0',
}));

const ScheduleValue = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '-0.01em',
  color: theme.palette.mode === 'light' ? '#475569' : '#cbd5e1',
}));

export const ScheduleCohortCard: FC<ScheduleCohortCardProps> = ({
  activeClass,
  onClick,
}) => {
  const theme = useTheme();
  const toBeAssigned =
    !activeClass.instructor.id ||
    activeClass.instructor.name.toLowerCase() === 'to be assigned' ||
    !activeClass.instructor.name;

  return (
    <StyledCard onClick={onClick}>
      <MainContent>
        <HeaderRow>
          <TitleRow>
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: 700,
                color: theme.palette.mode === 'light' ? '#0f172a' : '#ffffff',
              }}
            >
              {activeClass.title}
            </Typography>
            <MonthBadge>
              <ScheduleIcon sx={{ fontSize: 12 }} />
              Month {activeClass.month}
            </MonthBadge>
          </TitleRow>
        </HeaderRow>

        <InfoRow>
          <InfoItem>
            {activeClass.instructor.avatarUrl ? (
              <InstructorAvatar
                src={activeClass.instructor.avatarUrl}
                alt={activeClass.instructor.name}
                sx={{
                  backgroundImage: `url("${activeClass.instructor.avatarUrl}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            ) : (
              <InstructorAvatar>
                {toBeAssigned ? (
                  <PersonOffIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                ) : (
                  <PersonIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                )}
              </InstructorAvatar>
            )}
            <Box>
              <InfoLabel>Instructor</InfoLabel>
              <InfoValue isToBeAssigned={toBeAssigned}>
                {activeClass.instructor.name}
              </InfoValue>
            </Box>
          </InfoItem>

          <InfoItem>
            <CalendarMonthIcon
              sx={{
                fontSize: 20,
                color: theme.palette.mode === 'light' ? '#94a3b8' : '#64748b',
              }}
            />
            <Box>
              <InfoLabel>Schedule</InfoLabel>
              <ScheduleValue>
                {activeClass.schedule}
              </ScheduleValue>
            </Box>
          </InfoItem>
        </InfoRow>
      </MainContent>
    </StyledCard>
  );
};
