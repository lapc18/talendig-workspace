import { FC } from 'react';
import {
  Card,
  Box,
  Typography,
  IconButton,
  styled,
  CardContent,
  Chip,
  Link,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PersonIcon from '@mui/icons-material/Person';
import { IconTile } from '../IconTile';
import { StatusChip } from '../StatusChip';
import type { InstructorCardProps } from './InstructorCard.types';

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

export const InstructorCard: FC<InstructorCardProps> = ({
  title,
  subtitle,
  status,
  phone,
  bio,
  technologies,
  subjects,
  modulesCount,
  futureModulesCount,
  cvUrl,
  icon,
  onClick,
  onMenuClick,
}) => {
  return (
    <StyledCard onClick={onClick}>
      <StyledCardContent>
        <HeaderBox>
          {icon || <IconTile icon={<PersonIcon />} size="medium" />}
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
          {phone && (
            <MetadataRow>
              <LabelText
                variant="caption"
                sx={{
                  color: (theme) =>
                    theme.palette.mode === 'light' ? '#64748b' : '#94a3b8',
                }}
              >
                Phone
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
                {phone}
              </Typography>
            </MetadataRow>
          )}
          {bio && (
            <MetadataRow>
              <LabelText
                variant="caption"
                sx={{
                  color: (theme) =>
                    theme.palette.mode === 'light' ? '#64748b' : '#94a3b8',
                }}
              >
                Bio
              </LabelText>
              <Typography
                variant="body2"
                sx={{
                  fontSize: 14,
                  color: (theme) =>
                    theme.palette.mode === 'light' ? '#64748b' : '#94a3b8',
                  lineHeight: 1.5,
                  fontStyle: 'italic',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {bio}
              </Typography>
            </MetadataRow>
          )}
          {technologies && technologies.length > 0 && (
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
                Technologies
              </LabelText>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {technologies.slice(0, 3).map((tech, index) => (
                  <Chip key={index} label={tech} size="small" />
                ))}
                {technologies.length > 3 && (
                  <Chip
                    label={`+${technologies.length - 3}`}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
          )}
          {subjects && subjects.length > 0 && (
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
                Subjects
              </LabelText>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {subjects.slice(0, 3).map((subject, index) => (
                  <Chip key={index} label={subject} size="small" />
                ))}
                {subjects.length > 3 && (
                  <Chip
                    label={`+${subjects.length - 3}`}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
          )}
          {(modulesCount !== undefined || futureModulesCount !== undefined) && (
            <MetadataRow>
              <LabelText
                variant="caption"
                sx={{
                  color: (theme) =>
                    theme.palette.mode === 'light' ? '#64748b' : '#94a3b8',
                }}
              >
                Modules
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
                {modulesCount || 0} current
                {futureModulesCount !== undefined && futureModulesCount > 0
                  ? `, ${futureModulesCount} future`
                  : ''}
              </Typography>
            </MetadataRow>
          )}
          {cvUrl && (
            <Box>
              <Link
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                sx={{
                  fontSize: 14,
                  color: '#1337ec',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                View CV
              </Link>
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

export type { InstructorCardProps };

