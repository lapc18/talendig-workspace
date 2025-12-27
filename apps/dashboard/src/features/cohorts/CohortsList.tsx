import React, { FC, useEffect, useState } from 'react';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import { Edit as EditIcon, Block as BlockIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { useServices, LoadingSpinner, EntityCard } from '@talendig/shared';
import type { Cohort, Program, Student } from '@talendig/shared';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface CohortWithDetails extends Cohort {
  program?: Program;
  studentsCount: number;
}

export const CohortsList: FC = () => {
  const { cohortsService, programsService, studentsService } = useServices();
  const navigate = useNavigate();
  const [cohorts, setCohorts] = useState<CohortWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCohorts();
  }, []);

  const loadCohorts = async () => {
    try {
      setLoading(true);
      const data = await cohortsService.getAll();
      const activeCohorts = data.filter((cohort) => cohort.status === 'active');
      
      const cohortsWithDetails = await Promise.all(
        activeCohorts.map(async (cohort) => {
          const [program, students] = await Promise.all([
            cohort.programId
              ? programsService.getById(cohort.programId).catch(() => null)
              : Promise.resolve(null),
            studentsService.getByCohortId(cohort.id).catch(() => []),
          ]);
          
          return {
            ...cohort,
            program: program || undefined,
            studentsCount: students.length,
          };
        })
      );
      
      setCohorts(cohortsWithDetails);
    } catch (error) {
      console.error('Error loading cohorts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to deactivate this cohort?')) {
      try {
        await cohortsService.deactivate(id);
        loadCohorts();
      } catch (error) {
        console.error('Error deactivating cohort:', error);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {cohorts.map((cohort) => (
          <Grid item xs={12} sm={6} md={4} key={cohort.id}>
            <EntityCard
              title={cohort.name}
              subtitle={cohort.program?.name}
              status={cohort.status}
              statusPosition="right"
              onClick={() => navigate(`/cohorts/${cohort.id}`)}
              actions={
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/cohorts/${cohort.id}`);
                    }}
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/cohorts/${cohort.id}/edit`);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => handleDeactivate(cohort.id, e)}
                  >
                    <BlockIcon />
                  </IconButton>
                </Box>
              }
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {cohort.program && (
                  <Typography variant="body2" color="text.secondary">
                    Program:{' '}
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ fontWeight: 500, cursor: 'pointer' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/programs/${cohort.program!.id}`);
                      }}
                    >
                      {cohort.program.name}
                      {cohort.program.type ? ` (${cohort.program.type})` : ''}
                    </Typography>
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                  Students: <strong>{cohort.studentsCount}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Start: <strong>{format(new Date(cohort.startDate), 'MMM dd, yyyy')}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  End: <strong>{format(new Date(cohort.endDate), 'MMM dd, yyyy')}</strong>
                </Typography>
              </Box>
            </EntityCard>
          </Grid>
        ))}
      </Grid>
      {cohorts.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No cohorts found
          </Typography>
        </Box>
      )}
    </Box>
  );
};

