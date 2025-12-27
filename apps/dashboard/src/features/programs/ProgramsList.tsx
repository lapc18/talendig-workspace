import React, { FC, useEffect, useState } from 'react';
import { Box, Grid, IconButton, Typography, Button } from '@mui/material';
import { Edit as EditIcon, Block as BlockIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { useServices, LoadingSpinner, EntityCard } from '@talendig/shared';
import type { Program, Module } from '@talendig/shared';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface ProgramWithDetails extends Program {
  modulesCount: number;
  startDate?: string;
  endDate?: string;
}

export const ProgramsList: FC = () => {
  const { programsService, modulesService } = useServices();
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<ProgramWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      const data = await programsService.getAll();
      // Filter out inactive programs
      const activePrograms = data.filter((program) => program.status === 'active');
      
      // Load modules for each program to get count and dates
      const programsWithDetails = await Promise.all(
        activePrograms.map(async (program) => {
          try {
            const modules = await modulesService.getByProgramId(program.id);
            const modulesWithDates = modules.filter((m) => m.startDate || m.endDate);
            
            let startDate: string | undefined;
            let endDate: string | undefined;
            
            if (modulesWithDates.length > 0) {
              const dates = modulesWithDates
                .map((m) => m.startDate || m.endDate)
                .filter((d): d is string => !!d)
                .sort();
              if (dates.length > 0) {
                startDate = dates[0];
                endDate = dates[dates.length - 1];
              }
            }
            
            return {
              ...program,
              modulesCount: modules.length,
              startDate,
              endDate,
            };
          } catch (error) {
            console.error(`Error loading modules for program ${program.id}:`, error);
            return {
              ...program,
              modulesCount: 0,
            };
          }
        })
      );
      
      setPrograms(programsWithDetails);
    } catch (error) {
      console.error('Error loading programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to deactivate this program?')) {
      try {
        await programsService.deactivate(id);
        loadPrograms();
      } catch (error) {
        console.error('Error deactivating program:', error);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {programs.map((program) => (
          <Grid item xs={12} sm={6} md={4} key={program.id}>
            <EntityCard
              title={program.name}
              subtitle={program.description}
              status={program.status}
              statusPosition="right"
              onClick={() => navigate(`/programs/${program.id}`)}
              actions={
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/programs/${program.id}`);
                    }}
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/programs/${program.id}/edit`);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => handleDeactivate(program.id, e)}
                  >
                    <BlockIcon />
                  </IconButton>
                </Box>
              }
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {program.type && (
                  <Typography variant="body2" color="text.secondary">
                    Type: <strong>{program.type}</strong>
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                  Duration: <strong>{program.durationMonths} months</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Modules: <strong>{program.modulesCount}</strong>
                </Typography>
                {program.startDate && program.endDate && (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      Start: <strong>{format(new Date(program.startDate), 'MMM dd, yyyy')}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      End: <strong>{format(new Date(program.endDate), 'MMM dd, yyyy')}</strong>
                    </Typography>
                  </>
                )}
              </Box>
            </EntityCard>
          </Grid>
        ))}
      </Grid>
      {programs.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No programs found
          </Typography>
        </Box>
      )}
    </Box>
  );
};

