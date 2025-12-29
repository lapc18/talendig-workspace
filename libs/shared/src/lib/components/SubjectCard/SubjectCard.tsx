import { FC } from 'react';
import {
  Card,
  Box,
  Typography,
  IconButton,
  styled,
  CardContent,
  Chip,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BookIcon from '@mui/icons-material/Book';
import { IconTile } from '../IconTile';
import { StatusChip } from '../StatusChip';
import type { SubjectCardProps } from './SubjectCard.types';

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

const StyledCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
});

const HeaderBox = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  marginBottom: 12,
});

const MetadataBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  flex: 1,
});

const MetadataRow = styled(Box)<{ alignRight?: boolean }>(({ alignRight }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: alignRight ? 'space-between' : 'flex-start',
  gap: 8,
}));

const LabelText = styled(Typography)({
  fontSize: 12,
  flexShrink: 0,
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

export const SubjectCard: FC<SubjectCardProps> = ({
  title,
  subtitle,
  status,
  type,
  defaultHours,
  description,
  programs,
  icon,
  onClick,
  onMenuClick,
  onProgramClick,
}) => {
  return (
    <StyledCard onClick={onClick}>
      <StyledCardContent>
        <HeaderBox>
          {icon || <IconTile icon={<BookIcon />} size="medium" />}
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
            mb: 0.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            fontSize: 14,
            color: (theme) =>
              theme.palette.mode === 'light' ? '#64748b' : '#94a3b8',
            lineHeight: 1.5,
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {subtitle}
        </Typography>

        <MetadataBox>
          {type && (
            <MetadataRow>
              <LabelText
                variant="caption"
                sx={{
                  color: (theme) =>
                    theme.palette.mode === 'light' ? '#64748b' : '#94a3b8',
                }}
              >
                Type
              </LabelText>
              <Typography
                variant="body2"
                sx={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: (theme) => theme.palette.text.primary,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {type}
              </Typography>
            </MetadataRow>
          )}
          {defaultHours !== undefined && (
            <MetadataRow alignRight>
              <LabelText
                variant="caption"
                sx={{
                  color: (theme) =>
                    theme.palette.mode === 'light' ? '#64748b' : '#94a3b8',
                }}
              >
                Default Hours
              </LabelText>
              <Typography
                variant="body2"
                sx={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: (theme) => theme.palette.text.primary,
                }}
              >
                {defaultHours}h
              </Typography>
            </MetadataRow>
          )}
          {description && (
            <MetadataRow>
              <LabelText
                variant="caption"
                sx={{
                  color: (theme) =>
                    theme.palette.mode === 'light' ? '#64748b' : '#94a3b8',
                }}
              >
                Description
              </LabelText>
              <Typography
                variant="body2"
                sx={{
                  fontSize: 14,
                  color: (theme) =>
                    theme.palette.mode === 'light' ? '#64748b' : '#94a3b8',
                  lineHeight: 1.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {description}
              </Typography>
            </MetadataRow>
          )}
          {programs && programs.length > 0 && (
            <Box>
              <LabelText
                variant="caption"
                sx={{
                  color: (theme) =>
                    theme.palette.mode === 'light' ? '#64748b' : '#94a3b8',
                  mb: 0.5,
                  display: 'block',
                }}
              >
                Programs
              </LabelText>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {programs.slice(0, 3).map((program, index) => (
                  <Chip
                    key={index}
                    label={program}
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onProgramClick?.(e, index);
                    }}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
                {programs.length > 3 && (
                  <Chip
                    label={`+${programs.length - 3}`}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
          )}
        </MetadataBox>
      </StyledCardContent>

      <FooterBox>
        <StatusChip status={status} />
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

export type { SubjectCardProps };

