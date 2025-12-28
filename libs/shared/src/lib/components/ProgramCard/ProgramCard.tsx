import { FC } from 'react';
import {
  Card,
  Box,
  Typography,
  IconButton,
  Stack,
  styled,
  CardContent,
  CardActions,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { IconTile } from '../IconTile';
import { StatusChip } from '../StatusChip';
import type { ProgramCardProps } from './ProgramCard.types';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[2], // md shadow
  },
}));

const HeaderBox = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  marginBottom: 12,
});

const DescriptionBox = styled(Box)({
  marginBottom: 16,
  minHeight: 40,
  '& p': {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});

const MetadataBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  marginBottom: 16,
});

const MetadataRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const FooterBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: 16,
  paddingBottom: 16,
  paddingLeft: 20,
  paddingRight: 20,
  backgroundColor:
    theme.palette.mode === 'light'
      ? 'rgba(248,250,252,0.50)'
      : 'rgba(30,41,59,0.50)',
  borderTop: `1px solid ${theme.palette.mode === 'light' ? '#f1f5f9' : '#1f2937'}`,
}));

export const ProgramCard: FC<ProgramCardProps> = ({
  title,
  description,
  status,
  duration,
  modulesCount,
  studentsCount,
  date,
  icon,
  onClick,
  onMenuClick,
}) => {
  return (
    <StyledCard onClick={onClick}>
      <CardContent>
        <HeaderBox>
          {icon && <IconTile icon={icon} size="medium" />}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StatusChip status={status} />
            {onMenuClick && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onMenuClick(e);
                }}
                sx={{ padding: 0.5 }}
              >
                <MoreVertIcon sx={{ fontSize: 20 }} />
              </IconButton>
            )}
          </Box>
        </HeaderBox>

        <Typography
          variant="h6"
          sx={{
            fontSize: 18,
            fontWeight: 700,
            fontFamily: 'Lexend, sans-serif',
            color: (theme) => theme.palette.text.primary,
            mb: 1,
          }}
        >
          {title}
        </Typography>

        <DescriptionBox>
          <Typography
            variant="body2"
            sx={{
              fontSize: 14,
              color: (theme) =>
                theme.palette.mode === 'light' ? '#64748b' : '#94a3b8',
              lineHeight: 1.5,
            }}
          >
            {description}
          </Typography>
        </DescriptionBox>

        <MetadataBox>
          {duration && (
            <MetadataRow>
              <Typography
                variant="caption"
                sx={{
                  fontSize: 12,
                  color: (theme) =>
                    theme.palette.mode === 'light' ? '#64748b' : '#94a3b8',
                }}
              >
                Duration
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: (theme) => theme.palette.text.primary,
                }}
              >
                {duration}
              </Typography>
            </MetadataRow>
          )}
          {modulesCount !== undefined && (
            <MetadataRow>
              <Typography
                variant="caption"
                sx={{
                  fontSize: 12,
                  color: (theme) =>
                    theme.palette.mode === 'light' ? '#64748b' : '#94a3b8',
                }}
              >
                Modules
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: (theme) => theme.palette.text.primary,
                }}
              >
                {modulesCount}
              </Typography>
            </MetadataRow>
          )}
          {studentsCount !== undefined && (
            <MetadataRow>
              <Typography
                variant="caption"
                sx={{
                  fontSize: 12,
                  color: (theme) =>
                    theme.palette.mode === 'light' ? '#64748b' : '#94a3b8',
                }}
              >
                Students
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: (theme) => theme.palette.text.primary,
                }}
              >
                {studentsCount}
              </Typography>
            </MetadataRow>
          )}
        </MetadataBox>
      </CardContent>

      <FooterBox>
        {date && (
          <Typography
            variant="caption"
            sx={{
              fontSize: 12,
              color: (theme) =>
                theme.palette.mode === 'light' ? '#64748b' : '#94a3b8',
            }}
          >
            {date}
          </Typography>
        )}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            color: '#1337ec',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          View Details
          <ArrowForwardIcon sx={{ fontSize: 16 }} />
        </Box>
      </FooterBox>
    </StyledCard>
  );
};

export type { ProgramCardProps };

