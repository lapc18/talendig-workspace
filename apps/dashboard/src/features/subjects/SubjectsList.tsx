import { FC, useEffect, useState } from 'react';
import { Box, Grid, IconButton, Typography, Chip } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { useServices, LoadingSpinner, EntityCard } from '@talendig/shared';
import type { Subject, Module, Program } from '@talendig/shared';
import { useNavigate } from 'react-router-dom';

interface SubjectWithPrograms extends Subject {
  programs: Program[];
}

export const SubjectsList: FC = () => {
  const { subjectsService, modulesService, programsService } = useServices();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<SubjectWithPrograms[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const subjectsData = await subjectsService.getAll();
      const allModules = await modulesService.getAll();
      
      const subjectsWithPrograms = await Promise.all(
        subjectsData.map(async (subject) => {
          const modulesWithSubject = allModules.filter((m) => m.subjectId === subject.id);
          const programIds = new Set(modulesWithSubject.map((m) => m.programId));
          
          const programs = await Promise.all(
            Array.from(programIds).map((id) => programsService.getById(id).catch(() => null))
          );
          
          return {
            ...subject,
            programs: programs.filter((p): p is Program => !!p),
          };
        })
      );
      
      setSubjects(subjectsWithPrograms);
    } catch (error) {
      console.error('Error loading subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await subjectsService.delete(id);
        loadSubjects();
      } catch (error) {
        console.error('Error deleting subject:', error);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {subjects.map((subject) => (
          <Grid item xs={12} sm={6} md={4} key={subject.id}>
            <EntityCard
              title={subject.name}
              subtitle={subject.code}
              status={subject.status}
              statusPosition="right"
              onClick={() => navigate(`/subjects/${subject.id}`)}
              actions={
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/subjects/${subject.id}`);
                    }}
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/subjects/${subject.id}/edit`);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => handleDelete(subject.id, e)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Type: <strong>{subject.type}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Default Hours: <strong>{subject.defaultHours}h</strong>
                </Typography>
                {subject.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 0.5 }}>
                    {subject.description.length > 100
                      ? `${subject.description.substring(0, 100)}...`
                      : subject.description}
                  </Typography>
                )}
                {subject.programs.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Programs ({subject.programs.length}):
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {subject.programs.slice(0, 3).map((program) => (
                        <Chip
                          key={program.id}
                          label={program.name}
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/programs/${program.id}`);
                          }}
                          sx={{ cursor: 'pointer' }}
                        />
                      ))}
                      {subject.programs.length > 3 && (
                        <Chip label={`+${subject.programs.length - 3}`} size="small" />
                      )}
                    </Box>
                  </Box>
                )}
              </Box>
            </EntityCard>
          </Grid>
        ))}
      </Grid>
      {subjects.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No subjects found
          </Typography>
        </Box>
      )}
    </Box>
  );
};

