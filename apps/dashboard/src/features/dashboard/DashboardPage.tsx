import React, { FC, useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { useServices } from '@talendig/shared';
import { LoadingSpinner, Card } from '@talendig/shared';
import type { Program, Cohort, Student, Instructor } from '@talendig/shared';

export const DashboardPage: FC = () => {
  const { programsService, cohortsService, studentsService, instructorsService } = useServices();
  const [stats, setStats] = useState({
    programs: 0,
    cohorts: 0,
    students: 0,
    instructors: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [programs, cohorts, students, instructors] = await Promise.all([
        programsService.getAll(),
        cohortsService.getAll(),
        studentsService.getAll(),
        instructorsService.getAll(),
      ]);

      setStats({
        programs: programs.length,
        cohorts: cohorts.length,
        students: students.length,
        instructors: instructors.length,
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <Typography variant="h6" color="primary">
              Programs
            </Typography>
            <Typography variant="h3">{stats.programs}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <Typography variant="h6" color="primary">
              Cohorts
            </Typography>
            <Typography variant="h3">{stats.cohorts}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <Typography variant="h6" color="primary">
              Students
            </Typography>
            <Typography variant="h3">{stats.students}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <Typography variant="h6" color="primary">
              Instructors
            </Typography>
            <Typography variant="h3">{stats.instructors}</Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

