import { FC, useEffect, useState } from 'react';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { useServices, LoadingSpinner, EntityCard } from '@talendig/shared';
import type { Student, Cohort } from '@talendig/shared';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface StudentWithCohort extends Student {
  cohort?: Cohort;
}

export const StudentsList: FC = () => {
  const { studentsService, cohortsService } = useServices();
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentWithCohort[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await studentsService.getAll();
      
      const studentsWithCohorts = await Promise.all(
        data.map(async (student) => {
          if (student.cohortId) {
            try {
              const cohort = await cohortsService.getById(student.cohortId);
              return { ...student, cohort: cohort || undefined };
            } catch (error) {
              console.error(`Error loading cohort for student ${student.id}:`, error);
              return student;
            }
          }
          return student;
        })
      );
      
      setStudents(studentsWithCohorts);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentsService.delete(id);
        loadStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {students.map((student) => (
          <Grid item xs={12} sm={6} md={4} key={student.id}>
            <EntityCard
              title={student.fullName}
              subtitle={student.email}
              status={student.status}
              statusPosition="right"
              onClick={() => navigate(`/students/${student.id}`)}
              actions={
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/students/${student.id}`);
                    }}
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/students/${student.id}/edit`);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => handleDelete(student.id, e)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {student.cohort && (
                  <Typography variant="body2" color="text.secondary">
                    Cohort:{' '}
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ fontWeight: 500, cursor: 'pointer' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/cohorts/${student.cohort!.id}`);
                      }}
                    >
                      {student.cohort.name}
                    </Typography>
                  </Typography>
                )}
                {student.phone && (
                  <Typography variant="body2" color="text.secondary">
                    Phone: <strong>{student.phone}</strong>
                  </Typography>
                )}
                {student.birthDate && (
                  <Typography variant="body2" color="text.secondary">
                    Birth Date: <strong>{format(new Date(student.birthDate), 'MMM dd, yyyy')}</strong>
                  </Typography>
                )}
              </Box>
            </EntityCard>
          </Grid>
        ))}
      </Grid>
      {students.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No students found
          </Typography>
        </Box>
      )}
    </Box>
  );
};

