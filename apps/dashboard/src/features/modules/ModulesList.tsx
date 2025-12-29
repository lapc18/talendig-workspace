import { FC, useEffect, useState } from 'react';
import {
  Box,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import { Edit as EditIcon, Block as BlockIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { useServices, LoadingSpinner, EntityCard } from '@talendig/shared';
import type { Module, Program, Instructor, Subject } from '@talendig/shared';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface ModuleWithDetails extends Module {
  program?: Program;
  instructor?: Instructor;
  subject?: Subject;
}

export const ModulesList: FC = () => {
  const { modulesService, programsService, instructorsService, subjectsService } = useServices();
  const navigate = useNavigate();
  const [modules, setModules] = useState<ModuleWithDetails[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrograms();
  }, []);

  useEffect(() => {
    if (selectedProgramId) {
      loadModules();
    } else {
      loadAllModules();
    }
  }, [selectedProgramId]);

  const loadPrograms = async () => {
    try {
      const data = await programsService.getAll();
      setPrograms(data);
    } catch (error) {
      console.error('Error loading programs:', error);
    }
  };

  const loadModuleDetails = async (moduleList: Module[]): Promise<ModuleWithDetails[]> => {
    return Promise.all(
      moduleList.map(async (module) => {
        const moduleWithDetails: ModuleWithDetails = { ...module };
        
        if (module.programId) {
          try {
            const program = await programsService.getById(module.programId);
            if (program) moduleWithDetails.program = program;
          } catch (error) {
            console.error(`Error loading program for module ${module.id}:`, error);
          }
        }
        
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
  };

  const loadModules = async () => {
    try {
      setLoading(true);
      const data = await modulesService.getByProgramId(selectedProgramId);
      const activeModules = data.filter((module) => module.status === 'active');
      const modulesWithDetails = await loadModuleDetails(activeModules);
      setModules(modulesWithDetails);
    } catch (error) {
      console.error('Error loading modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllModules = async () => {
    try {
      setLoading(true);
      const data = await modulesService.getAll();
      const activeModules = data.filter((module) => module.status === 'active');
      const modulesWithDetails = await loadModuleDetails(activeModules);
      setModules(modulesWithDetails);
    } catch (error) {
      console.error('Error loading modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to deactivate this module?')) {
      try {
        await modulesService.deactivate(id);
        if (selectedProgramId) {
          loadModules();
        } else {
          loadAllModules();
        }
      } catch (error) {
        console.error('Error deactivating module:', error);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      <FormControl fullWidth sx={{ mb: 3, maxWidth: 300 }}>
        <InputLabel>Filter by Program</InputLabel>
        <Select
          value={selectedProgramId}
          onChange={(e) => setSelectedProgramId(e.target.value)}
          label="Filter by Program"
        >
          <MenuItem value="">All Programs</MenuItem>
          {programs.map((program) => (
            <MenuItem key={program.id} value={program.id}>
              {program.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <Grid container spacing={3}>
        {modules.map((module) => (
          <Grid item xs={12} sm={6} md={4} key={module.id}>
            <EntityCard
              title={`Month ${module.month}`}
              subtitle={module.program?.name}
              status={module.status}
              statusPosition="right"
              onClick={() => navigate(`/modules/${module.id}`)}
              actions={
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/modules/${module.id}`);
                    }}
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/modules/${module.id}/edit`);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => handleDeactivate(module.id, e)}
                  >
                    <BlockIcon />
                  </IconButton>
                </Box>
              }
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {module.program && (
                  <Typography variant="body2" color="text.secondary">
                    Program:{' '}
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ fontWeight: 500, cursor: 'pointer' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/programs/${module.program!.id}`);
                      }}
                    >
                      {module.program.name}
                    </Typography>
                  </Typography>
                )}
                
                {module.instructor && (
                  <Typography variant="body2" color="text.secondary">
                    Instructor: <strong>{module.instructor.fullName}</strong>
                  </Typography>
                )}
                
                {module.subject && (
                  <Typography variant="body2" color="text.secondary">
                    Subject: <strong>{module.subject.name} ({module.subject.code})</strong>
                  </Typography>
                )}
                
                <Typography variant="body2" color="text.secondary">
                  Hours: <strong>{module.hours}h</strong>
                </Typography>
                
                {(module.startDate || module.endDate) && (
                  <>
                    {module.startDate && (
                      <Typography variant="body2" color="text.secondary">
                        Start: <strong>{format(new Date(module.startDate), 'MMM dd, yyyy')}</strong>
                      </Typography>
                    )}
                    {module.endDate && (
                      <Typography variant="body2" color="text.secondary">
                        End: <strong>{format(new Date(module.endDate), 'MMM dd, yyyy')}</strong>
                      </Typography>
                    )}
                  </>
                )}
              </Box>
            </EntityCard>
          </Grid>
        ))}
      </Grid>
      
      {modules.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No modules found
          </Typography>
        </Box>
      )}
    </Box>
  );
};

