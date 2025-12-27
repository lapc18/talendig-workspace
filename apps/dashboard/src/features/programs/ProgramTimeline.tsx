import React, { FC, useEffect, useState } from 'react';
import { Box, Paper, Typography, Chip, Link } from '@mui/material';
import { useServices } from '@talendig/shared';
import type { Module, Instructor, Subject } from '@talendig/shared';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface ProgramTimelineProps {
  modules: Module[];
}

interface ModuleWithDetails extends Module {
  instructor?: Instructor;
  subject?: Subject;
}

export const ProgramTimeline: FC<ProgramTimelineProps> = ({ modules }) => {
  const { instructorsService, subjectsService } = useServices();
  const navigate = useNavigate();
  const [modulesWithDetails, setModulesWithDetails] = useState<ModuleWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModuleDetails();
  }, [modules]);

  const loadModuleDetails = async () => {
    try {
      setLoading(true);
      const details = await Promise.all(
        modules.map(async (module) => {
          const moduleWithDetails: ModuleWithDetails = { ...module };
          
          if (module.instructorId) {
            try {
              const instructor = await instructorsService.getById(module.instructorId);
              if (instructor) moduleWithDetails.instructor = instructor;
            } catch (error) {
              console.error(`Error loading instructor for module ${module.id}:`, error);
            }
          }
          
          if (module.subjectId) {
            try {
              const subject = await subjectsService.getById(module.subjectId);
              if (subject) moduleWithDetails.subject = subject;
            } catch (error) {
              console.error(`Error loading subject for module ${module.id}:`, error);
            }
          }
          
          return moduleWithDetails;
        })
      );
      setModulesWithDetails(details);
    } catch (error) {
      console.error('Error loading module details:', error);
      setModulesWithDetails(modules);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Program Timeline
      </Typography>
      <Box sx={{ mt: 2 }}>
        {loading ? (
          <Typography color="text.secondary">Loading modules...</Typography>
        ) : modulesWithDetails.length === 0 ? (
          <Typography color="text.secondary">No modules assigned yet</Typography>
        ) : (
          modulesWithDetails.map((module) => (
            <Box
              key={module.id}
              sx={{
                p: 2,
                mb: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Month {module.month}
                </Typography>
                <Chip label={`${module.hours}h`} size="small" />
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                {module.instructor && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Instructor:{' '}
                      <Link
                        component="button"
                        variant="body2"
                        onClick={() => navigate(`/instructors/${module.instructor!.id}`)}
                        sx={{ cursor: 'pointer', textDecoration: 'none' }}
                      >
                        {module.instructor.fullName}
                      </Link>
                    </Typography>
                  </Box>
                )}
                
                {module.subject && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Subject:{' '}
                      <Link
                        component="button"
                        variant="body2"
                        onClick={() => navigate(`/subjects/${module.subject!.id}`)}
                        sx={{ cursor: 'pointer', textDecoration: 'none' }}
                      >
                        {module.subject.name} ({module.subject.code})
                      </Link>
                    </Typography>
                  </Box>
                )}
                
                {(module.startDate || module.endDate) && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {module.startDate && `Start: ${format(new Date(module.startDate), 'MMM dd, yyyy')}`}
                      {module.startDate && module.endDate && ' • '}
                      {module.endDate && `End: ${format(new Date(module.endDate), 'MMM dd, yyyy')}`}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Paper>
  );
};

