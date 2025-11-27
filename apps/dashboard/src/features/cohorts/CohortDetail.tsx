import React, { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, Chip } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useServices } from '@talendig/shared';
import type { Cohort, Student } from '@talendig/shared';
import { LoadingSpinner, PageHeader } from '@talendig/shared';
import { StudentRoster } from './StudentRoster';

export const CohortDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cohortsService, studentsService } = useServices();
  const [cohort, setCohort] = useState<Cohort | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
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
    } catch (error) {
      console.error('Error loading cohort:', error);
    } finally {
      setLoading(false);
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
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Cohort Details
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
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
            <Chip
              label={cohort.status}
              color={cohort.status === 'active' ? 'success' : 'default'}
              size="small"
            />
          </Box>
        </Box>
      </Paper>
      <StudentRoster cohortId={cohort.id} students={students} onUpdate={loadStudents} />
    </Box>
  );
};

