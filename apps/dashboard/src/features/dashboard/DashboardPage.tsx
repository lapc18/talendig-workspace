import React, { FC, useEffect, useState, useCallback } from 'react';
import { Box, Grid, Card, Typography } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import { useServices } from '@talendig/shared';
import {
  LoadingSpinner,
  StatCard,
  ActivityList,
  ActivityRow,
} from '@talendig/shared';
import { format } from 'date-fns';

export const DashboardPage: FC = () => {
  const { programsService, cohortsService, studentsService, instructorsService } =
    useServices();
  const [stats, setStats] = useState({
    programs: 0,
    cohorts: 0,
    students: 0,
    instructors: 0,
  });
  const [recentActivity, setRecentActivity] = useState<
    Array<{
      icon: React.ReactNode;
      description: string;
      timestamp: string;
      status?: 'active' | 'inactive' | 'completed' | 'cancelled' | 'pending';
    }>
  >([]);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
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

      // Generate recent activity from latest programs and cohorts
      const activities: typeof recentActivity = [];
      const recentPrograms = programs
        .sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, 3);
      const recentCohorts = cohorts
        .sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, 3);

      recentPrograms.forEach((program) => {
        let timestamp = 'Recently';
        if (program.createdAt) {
          try {
            const date = new Date(program.createdAt);
            if (!isNaN(date.getTime())) {
              timestamp = format(date, 'MMM dd, yyyy');
            }
          } catch {
            // Invalid date, use default
          }
        }
        activities.push({
          icon: <SchoolIcon />,
          description: `New program "${program.name}" created`,
          timestamp,
          status: program.status,
        });
      });

      recentCohorts.forEach((cohort) => {
        let timestamp = 'Recently';
        if (cohort.createdAt) {
          try {
            const date = new Date(cohort.createdAt);
            if (!isNaN(date.getTime())) {
              timestamp = format(date, 'MMM dd, yyyy');
            }
          } catch {
            // Invalid date, use default
          }
        }
        activities.push({
          icon: <GroupIcon />,
          description: `New cohort "${cohort.name}" created`,
          timestamp,
          status: cohort.status,
        });
      });

      setRecentActivity(activities.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  }, [programsService, cohortsService, studentsService, instructorsService]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {/* KPI Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<SchoolIcon />}
            label="Programs"
            value={stats.programs}
            trend="up"
            trendValue={5}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<GroupIcon />}
            label="Cohorts"
            value={stats.cohorts}
            trend="up"
            trendValue={12}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<PeopleIcon />}
            label="Students"
            value={stats.students}
            trend="up"
            trendValue={8}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<PersonIcon />}
            label="Instructors"
            value={stats.instructors}
            trend="up"
            trendValue={3}
          />
        </Grid>

        {/* Charts Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <Box sx={{ padding: 3 }}>
              <Typography
                variant="h3"
                sx={{
                  fontSize: 18,
                  fontWeight: 700,
                  fontFamily: 'Lexend, sans-serif',
                  mb: 2,
                }}
              >
                Student Enrollment Trends
              </Typography>
              <Box
                sx={{
                  height: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'light' ? '#f8fafc' : '#1e293b',
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: (theme) =>
                      theme.palette.mode === 'light' ? '#64748b' : '#94a3b8',
                  }}
                >
                  Chart placeholder
            </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <Box sx={{ padding: 3 }}>
              <Typography
                variant="h3"
                sx={{
                  fontSize: 18,
                  fontWeight: 700,
                  fontFamily: 'Lexend, sans-serif',
                  mb: 2,
                }}
              >
                Cohorts by Program
              </Typography>
              <Box
                sx={{
                  height: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'light' ? '#f8fafc' : '#1e293b',
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: (theme) =>
                      theme.palette.mode === 'light' ? '#64748b' : '#94a3b8',
                  }}
                >
                  Chart placeholder
            </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <ActivityList title="Recent Activity" viewAllHref="/activity">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <ActivityRow
                  key={index}
                  icon={activity.icon}
                  description={activity.description}
                  timestamp={activity.timestamp}
                  status={activity.status}
                />
              ))
            ) : (
              <Typography
                variant="body2"
                sx={{
                  color: (theme) =>
                    theme.palette.mode === 'light' ? '#64748b' : '#94a3b8',
                  textAlign: 'center',
                  py: 4,
                }}
              >
                No recent activity
              </Typography>
            )}
          </ActivityList>
        </Grid>
      </Grid>
    </Box>
  );
};

