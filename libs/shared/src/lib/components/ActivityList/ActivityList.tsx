import { FC } from 'react';
import { Card, CardHeader, Box, Link, styled } from '@mui/material';
import type { ActivityListProps } from './ActivityList.types';

const StyledCard = styled(Card)({
  display: 'flex',
  flexDirection: 'column',
});

const StyledCardHeader = styled(CardHeader)({
  padding: 20,
  paddingBottom: 16,
  '& .MuiCardHeader-title': {
    fontSize: 18,
    fontWeight: 700,
    fontFamily: 'Lexend, sans-serif',
  },
  '& .MuiCardHeader-action': {
    margin: 0,
    alignSelf: 'center',
  },
});

const ContentBox = styled(Box)({
  padding: 20,
  paddingTop: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
});

export const ActivityList: FC<ActivityListProps> = ({
  title,
  viewAllHref,
  children,
}) => {
  return (
    <StyledCard>
      <StyledCardHeader
        title={title}
        action={
          viewAllHref && (
            <Link
              href={viewAllHref}
              sx={{
                fontSize: 14,
                fontWeight: 500,
                color: '#1337ec',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              View All
            </Link>
          )
        }
      />
      <ContentBox>{children}</ContentBox>
    </StyledCard>
  );
};

export type { ActivityListProps };

