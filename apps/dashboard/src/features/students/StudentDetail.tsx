import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, Typography, Button, Link } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon } from '@mui/icons-material';
import { useServices, LoadingSpinner, PageHeader, StatusChip } from '@talendig/shared';
import type { Student, Cohort } from '@talendig/shared';
import { format } from 'date-fns';

export const StudentDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { studentsService, cohortsService } = useServices();
  const [student, setStudent] = useState<Student | null>(null);
  const [cohort, setCohort] = useState<Cohort | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadStudent();
    }
  }, [id]);

  const loadStudent = async () => {
    if (!id) return;
    try {
      const data = await studentsService.getById(id);
      setStudent(data);
      if (data?.cohortId) {
        try {
          const cohortData = await cohortsService.getById(data.cohortId);
          setCohort(cohortData);
        } catch (error) {
          console.error('Error loading cohort:', error);
        }
      }
    } catch (error) {
      console.error('Error loading student:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!student) {
    return <div>Student not found</div>;
  }

  return (
    <Box>
      <PageHeader
        title={student.fullName}
        subtitle={student.email}
        actions={
          <>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/students/${id}/edit`)}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/students')}
            >
              Back
            </Button>
          </>
        }
      />
      <Card
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3, // xl
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? '#ffffff' : '#0f172a',
          border: (theme) =>
            `1px solid ${theme.palette.mode === 'light' ? '#e2e8f0' : '#1f2937'}`,
          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06)',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Student Details
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Full Name
            </Typography>
            <Typography>{student.fullName}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Email
            </Typography>
            <Typography>{student.email}</Typography>
          </Box>
          {student.phone && (
            <Box>
              <Typography variant="body2" color="text.secondary">
                Phone
              </Typography>
              <Typography>{student.phone}</Typography>
            </Box>
          )}
          {student.birthDate && (
            <Box>
              <Typography variant="body2" color="text.secondary">
                Birth Date
              </Typography>
              <Typography>{format(new Date(student.birthDate), 'MMM dd, yyyy')}</Typography>
            </Box>
          )}
          <Box>
            <Typography variant="body2" color="text.secondary">
              Status
            </Typography>
            <StatusChip status={student.status} />
          </Box>
        </Box>
      </Card>
      {cohort && (
        <Card
          sx={{
            p: 3,
            borderRadius: 3, // xl
            backgroundColor: (theme) =>
              theme.palette.mode === 'light' ? '#ffffff' : '#0f172a',
            border: (theme) =>
              `1px solid ${theme.palette.mode === 'light' ? '#e2e8f0' : '#1f2937'}`,
            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06)',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Cohort Assignment
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Link
              component="button"
              variant="body1"
              onClick={() => navigate(`/cohorts/${cohort.id}`)}
              sx={{ cursor: 'pointer' }}
            >
              {cohort.name}
            </Link>
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Start: {format(new Date(cohort.startDate), 'MMM dd, yyyy')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                End: {format(new Date(cohort.endDate), 'MMM dd, yyyy')}
              </Typography>
            </Box>
          </Box>
        </Card>
      )}
    </Box>
  );
};

