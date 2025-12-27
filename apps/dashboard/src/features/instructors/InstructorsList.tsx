import { FC, useEffect, useState } from 'react';
import { Box, Grid, IconButton, Typography, Chip, Link } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { useServices, LoadingSpinner, EntityCard } from '@talendig/shared';
import type { Instructor, Module, Program, Subject } from '@talendig/shared';
import { useNavigate } from 'react-router-dom';
import { format, isFuture } from 'date-fns';

interface InstructorWithDetails extends Instructor {
  modules: Array<Module & { program?: Program; subject?: Subject }>;
  subjects: Subject[];
}

export const InstructorsList: FC = () => {
  const { instructorsService, modulesService, programsService, subjectsService } = useServices();
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState<InstructorWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);

  useEffect(() => {
    loadInstructors();
  }, []);

  const loadInstructors = async () => {
    try {
      setLoading(true);
      const instructorsData = await instructorsService.getAll();
      
      const instructorsWithDetails = await Promise.all(
        instructorsData.map(async (instructor) => {
          try {
            const modules = await modulesService.getByInstructorId(instructor.id);
            
            const modulesWithDetails = await Promise.all(
              modules.map(async (module) => {
                const [program, subject] = await Promise.all([
                  module.programId
                    ? programsService.getById(module.programId).catch(() => null)
                    : Promise.resolve(null),
                  module.subjectId
                    ? subjectsService.getById(module.subjectId).catch(() => null)
                    : Promise.resolve(null),
                ]);
                
                return {
                  ...module,
                  program: program || undefined,
                  subject: subject || undefined,
                };
              })
            );
            
            // Get unique subjects from modules
            const subjectIds = new Set(
              modulesWithDetails
                .map((m) => m.subject?.id)
                .filter((id): id is string => !!id)
            );
            const subjects = await Promise.all(
              Array.from(subjectIds).map((id) => subjectsService.getById(id))
            );
            
            return {
              ...instructor,
              modules: modulesWithDetails,
              subjects: subjects.filter((s): s is Subject => !!s),
            };
          } catch (error) {
            console.error(`Error loading details for instructor ${instructor.id}:`, error);
            return {
              ...instructor,
              modules: [],
              subjects: [],
            };
          }
        })
      );
      
      setInstructors(instructorsWithDetails);
    } catch (error) {
      console.error('Error loading instructors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (instructor: Instructor, event: React.MouseEvent) => {
    event.stopPropagation();
    setEditingInstructor(instructor);
    navigate(`/instructors/${instructor.id}/edit`);
  };

  const handleDelete = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this instructor?')) {
      try {
        await instructorsService.delete(id);
        loadInstructors();
      } catch (error) {
        console.error('Error deleting instructor:', error);
      }
    }
  };

  const getCurrentModules = (modules: InstructorWithDetails['modules']) => {
    const now = new Date();
    return modules.filter((m) => {
      if (!m.startDate || !m.endDate) return false;
      const start = new Date(m.startDate);
      const end = new Date(m.endDate);
      return start <= now && end >= now;
    });
  };

  const getFutureModules = (modules: InstructorWithDetails['modules']) => {
    return modules.filter((m) => {
      if (!m.startDate) return false;
      return isFuture(new Date(m.startDate));
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {instructors.map((instructor) => {
          const currentModules = getCurrentModules(instructor.modules);
          const futureModules = getFutureModules(instructor.modules);
          
          return (
            <Grid item xs={12} sm={6} md={4} key={instructor.id}>
              <EntityCard
                title={instructor.fullName}
                subtitle={instructor.email}
                status={instructor.status}
                statusPosition="right"
                onClick={() => navigate(`/instructors/${instructor.id}`)}
                actions={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/instructors/${instructor.id}`);
                      }}
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => handleEditClick(instructor, e)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => handleDelete(instructor.id, e)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {instructor.phone && (
                    <Typography variant="body2" color="text.secondary">
                      Phone: <strong>{instructor.phone}</strong>
                    </Typography>
                  )}
                  
                  {instructor.shortBio && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      {instructor.shortBio}
                    </Typography>
                  )}
                  
                  {instructor.technologies.length > 0 && (
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Technologies:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {instructor.technologies.slice(0, 3).map((tech) => (
                          <Chip key={tech} label={tech} size="small" />
                        ))}
                        {instructor.technologies.length > 3 && (
                          <Chip label={`+${instructor.technologies.length - 3}`} size="small" />
                        )}
                      </Box>
                    </Box>
                  )}
                  
                  {instructor.subjects.length > 0 && (
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Subjects:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {instructor.subjects.slice(0, 3).map((subject) => (
                          <Chip key={subject.id} label={subject.name} size="small" />
                        ))}
                        {instructor.subjects.length > 3 && (
                          <Chip label={`+${instructor.subjects.length - 3}`} size="small" />
                        )}
                      </Box>
                    </Box>
                  )}
                  
                  {(currentModules.length > 0 || futureModules.length > 0) && (
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Modules: <strong>{currentModules.length} current</strong>
                        {futureModules.length > 0 && `, ${futureModules.length} future`}
                      </Typography>
                    </Box>
                  )}
                  
                  {instructor.cvUrl && (
                    <Typography variant="body2" color="primary">
                      <Link href={instructor.cvUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                        View CV
                      </Link>
                    </Typography>
                  )}
                </Box>
              </EntityCard>
            </Grid>
          );
        })}
      </Grid>
      {instructors.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No instructors found
          </Typography>
        </Box>
      )}
    </Box>
  );
};

