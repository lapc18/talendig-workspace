import React, { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, Chip, Link } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon } from '@mui/icons-material';
import { useServices, LoadingSpinner, PageHeader, StatusIndicator } from '@talendig/shared';
import type { Subject, Module, Program } from '@talendig/shared';

export const SubjectDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { subjectsService, modulesService, programsService } = useServices();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadSubject();
      loadPrograms();
    }
  }, [id]);

  const loadSubject = async () => {
    if (!id) return;
    try {
      const data = await subjectsService.getById(id);
      setSubject(data);
    } catch (error) {
      console.error('Error loading subject:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPrograms = async () => {
    if (!id) return;
    try {
      const allModules = await modulesService.getAll();
      const modulesWithSubject = allModules.filter((m) => m.subjectId === id);
      setModules(modulesWithSubject);
      
      const programIds = new Set(modulesWithSubject.map((m) => m.programId));
      
      const programsData = await Promise.all(
        Array.from(programIds).map((programId) =>
          programsService.getById(programId).catch(() => null)
        )
      );
      
      setPrograms(programsData.filter((p): p is Program => !!p));
    } catch (error) {
      console.error('Error loading programs:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!subject) {
    return <div>Subject not found</div>;
  }

  return (
    <Box>
      <PageHeader
        title={subject.name}
        subtitle={subject.code}
        actions={
          <>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/subjects/${id}/edit`)}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/subjects')}
            >
              Back
            </Button>
          </>
        }
      />
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Subject Details
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Code
            </Typography>
            <Typography>{subject.code}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Type
            </Typography>
            <Typography>{subject.type}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Default Hours
            </Typography>
            <Typography>{subject.defaultHours} hours</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Status
            </Typography>
            <StatusIndicator status={subject.status} variant="chip" size="small" />
          </Box>
        </Box>
        {subject.description && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Description
            </Typography>
            <Typography>{subject.description}</Typography>
          </Box>
        )}
      </Paper>
      
      {programs.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Programs Using This Subject ({programs.length})
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
            {programs.map((program) => (
              <Chip
                key={program.id}
                label={program.name}
                onClick={() => navigate(`/programs/${program.id}`)}
                sx={{ cursor: 'pointer' }}
                variant="outlined"
              />
            ))}
          </Box>
        </Paper>
      )}
      
      {modules.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Modules Using This Subject ({modules.length})
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
            {modules.map((module) => {
              const program = programs.find((p) => p.id === module.programId);
              return (
                <Box
                  key={module.id}
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Month {module.month}
                    </Typography>
                    {program && (
                      <Typography variant="body2" color="text.secondary">
                        Program:{' '}
                        <Link
                          component="button"
                          variant="body2"
                          onClick={() => navigate(`/programs/${program.id}`)}
                          sx={{ cursor: 'pointer', textDecoration: 'none' }}
                        >
                          {program.name}
                        </Link>
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      Hours: {module.hours}h
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => navigate(`/modules/${module.id}`)}
                  >
                    View Module
                  </Button>
                </Box>
              );
            })}
          </Box>
        </Paper>
      )}
      
      {programs.length === 0 && modules.length === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1" color="text.secondary" align="center">
            This subject is not currently assigned to any programs or modules.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

