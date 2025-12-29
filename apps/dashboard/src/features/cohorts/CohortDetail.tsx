import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, Typography, Button, Link } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useServices } from '@talendig/shared';
import type { Cohort, Student, Program } from '@talendig/shared';
import { LoadingSpinner, PageHeader, StatusChip } from '@talendig/shared';
import { StudentRoster } from './StudentRoster';
import { CohortModuleAssignments } from './components/CohortModuleAssignments';

export const CohortDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cohortsService, studentsService, programsService } = useServices();
  const [cohort, setCohort] = useState<Cohort | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadCohort();
      loadStudents();
    }
  }, [id]);

  const loadCohort = async () => {
    if (!id) return;
    try {
      const data = await cohortsService.getById(id);
      setCohort(data);
      if (data?.programId) {
        loadProgram(data.programId);
      }
    } catch (error) {
      console.error('Error loading cohort:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProgram = async (programId: string) => {
    try {
      const data = await programsService.getById(programId);
      setProgram(data);
    } catch (error) {
      console.error('Error loading program:', error);
    }
  };

  const loadStudents = async () => {
    if (!id) return;
    try {
      const data = await studentsService.getByCohortId(id);
      setStudents(data);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!cohort) {
    return <div>Cohort not found</div>;
  }

  return (
    <Box>
      <PageHeader
        title={cohort.name}
        subtitle={`Cohort details and student roster`}
        actions={
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/cohorts')}
          >
            Back
          </Button>
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
          Cohort Details
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Students
            </Typography>
            <Typography variant="h6">{students.length} students</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Start Date
            </Typography>
            <Typography>{new Date(cohort.startDate).toLocaleDateString()}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              End Date
            </Typography>
            <Typography>{new Date(cohort.endDate).toLocaleDateString()}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Status
            </Typography>
            <StatusChip status={cohort.status} />
          </Box>
          {program && (
            <Box>
              <Typography variant="body2" color="text.secondary">
                Linked Program
              </Typography>
              <Link
                component="button"
                variant="body1"
                onClick={() => navigate(`/programs/${program.id}`)}
                sx={{ cursor: 'pointer' }}
              >
                {program.name}
                {program.type ? ` (${program.type})` : ''}
              </Link>
            </Box>
          )}
        </Box>
      </Card>
      {program && (
        <CohortModuleAssignments cohortId={cohort.id} programId={program.id} />
      )}
      <Box sx={{ mt: 3 }}>
        <StudentRoster cohortId={cohort.id} students={students} onUpdate={loadStudents} />
      </Box>
    </Box>
  );
};

