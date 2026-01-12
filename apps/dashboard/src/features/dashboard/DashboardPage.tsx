import { FC, useEffect, useState, useCallback, useRef } from 'react';
import { Box, Grid, Card, Typography, useTheme } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import { useServices } from '@talendig/shared';
import type { Student, Cohort, Program } from '@talendig/shared';
import {
  LoadingSpinner,
  StatCard,
  ActivityList,
  ActivityRow,
} from '@talendig/shared';
import { format, startOfMonth, parseISO } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

interface EnrollmentDataPoint {
  month: string;
  count: number;
}

interface CohortsByProgramDataPoint {
  programName: string;
  count: number;
}

export const DashboardPage: FC = () => {
  const theme = useTheme();
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
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentDataPoint[]>([]);
  const [cohortsByProgramData, setCohortsByProgramData] = useState<
    CohortsByProgramDataPoint[]
  >([]);
  const [loading, setLoading] = useState(true);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(600);

  // Transform students data into cumulative enrollment by month
  const transformEnrollmentData = useCallback(
    (students: Student[]): EnrollmentDataPoint[] => {
      if (students.length === 0) return [];

      // Group students by month based on createdAt
      const monthlyGroups = new Map<string, number>();

      students.forEach((student) => {
        if (!student.createdAt) return;

        try {
          let date: Date;

          // Handle Firestore Timestamp
          if (student.createdAt instanceof Timestamp) {
            date = student.createdAt.toDate();
          } else if (typeof student.createdAt === 'string') {
            date = parseISO(student.createdAt);
          } else if (student.createdAt instanceof Date) {
            date = student.createdAt;
          } else {
            // Try to convert object with seconds/nanoseconds (Firestore Timestamp structure)
            const timestamp = student.createdAt as { seconds?: number; nanoseconds?: number };
            if (timestamp.seconds !== undefined) {
              date = new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000);
            } else {
              date = new Date(student.createdAt);
            }
          }

          if (isNaN(date.getTime())) return;

          const monthKey = format(startOfMonth(date), 'MMM yyyy');
          monthlyGroups.set(monthKey, (monthlyGroups.get(monthKey) || 0) + 1);
        } catch (error) {
          // Invalid date, skip
          console.debug('Skipping student with invalid createdAt:', student.id, student.createdAt, error);
        }
      });

      if (monthlyGroups.size === 0) return [];

      // Sort by date and calculate cumulative counts
      const sortedMonths = Array.from(monthlyGroups.entries()).sort((a, b) => {
        // Parse month strings like "Jan 2025" by converting to a parseable format
        const parseMonthString = (monthStr: string): Date => {
          const [month, year] = monthStr.split(' ');
          const monthMap: Record<string, string> = {
            Jan: '01',
            Feb: '02',
            Mar: '03',
            Apr: '04',
            May: '05',
            Jun: '06',
            Jul: '07',
            Aug: '08',
            Sep: '09',
            Oct: '10',
            Nov: '11',
            Dec: '12',
          };
          return parseISO(`${year}-${monthMap[month] || '01'}-01`);
        };
        const dateA = parseMonthString(a[0]);
        const dateB = parseMonthString(b[0]);
        return dateA.getTime() - dateB.getTime();
      });

      let cumulativeCount = 0;
      return sortedMonths.map(([month, count]) => {
        cumulativeCount += count;
        return { month, count: cumulativeCount };
      });
    },
    []
  );

  // Transform cohorts data into count by program
  const transformCohortsByProgram = useCallback(
    (cohorts: Cohort[], programs: Program[]): CohortsByProgramDataPoint[] => {
      if (cohorts.length === 0) return [];

      // Create a map of programId to program name
      const programMap = new Map<string, string>();
      programs.forEach((program) => {
        programMap.set(program.id, program.name);
      });

      // Group cohorts by programId
      const programCounts = new Map<string, number>();
      cohorts.forEach((cohort) => {
        const count = programCounts.get(cohort.programId) || 0;
        programCounts.set(cohort.programId, count + 1);
      });

      // Convert to array and resolve program names
      const result: CohortsByProgramDataPoint[] = Array.from(
        programCounts.entries()
      )
        .map(([programId, count]) => ({
          programName: programMap.get(programId) || `Program ${programId}`,
          count,
        }))
        .sort((a, b) => b.count - a.count); // Sort by count descending

      return result;
    },
    []
  );

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

      // Calculate chart data
      const enrollmentChartData = transformEnrollmentData(students);
      const cohortsChartData = transformCohortsByProgram(cohorts, programs);

      setEnrollmentData(enrollmentChartData);
      setCohortsByProgramData(cohortsChartData);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  }, [
    programsService,
    cohortsService,
    studentsService,
    instructorsService,
    transformEnrollmentData,
    transformCohortsByProgram,
  ]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Update chart width on resize
  useEffect(() => {
    const updateChartWidth = () => {
      if (chartContainerRef.current) {
        const containerWidth = chartContainerRef.current.offsetWidth;
        setChartWidth(Math.max(containerWidth - 60, 400)); // Account for padding and margins
      }
    };

    updateChartWidth();
    window.addEventListener('resize', updateChartWidth);
    return () => window.removeEventListener('resize', updateChartWidth);
  }, []);

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
              {enrollmentData.length > 0 ? (
                <Box
                  ref={chartContainerRef}
                  sx={{
                    width: '100%',
                    height: 300,
                    overflow: 'hidden',
                    '& .MuiChartsAxis-root': {
                      fill: theme.palette.text.secondary,
                    },
                    '& .MuiChartsLegend-root': {
                      fill: theme.palette.text.primary,
                    },
                  }}
                >
                  <LineChart
                    width={chartWidth}
                    height={300}
                    series={[
                      {
                        data: enrollmentData.map((d) => d.count),
                        label: 'Total Enrolled',
                        color: theme.palette.primary.main,
                      },
                    ]}
                    xAxis={[
                      {
                        data: enrollmentData.map((d) => d.month),
                        scaleType: 'point',
                        label: 'Month',
                      },
                    ]}
                    yAxis={[
                      {
                        label: 'Students',
                      },
                    ]}
                    grid={{ vertical: true, horizontal: true }}
                    margin={{ top: 20, right: 30, bottom: 60, left: 60 }}
                  />
                </Box>
              ) : (
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
                    No enrollment data available
                  </Typography>
                </Box>
              )}
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
              {cohortsByProgramData.length > 0 ? (
                <Box sx={{ width: '100%', height: 300 }}>
                  <BarChart
                    width={undefined}
                    height={300}
                    series={[
                      {
                        data: cohortsByProgramData.map((d) => d.count),
                        label: 'Cohorts',
                        color: theme.palette.primary.main,
                      },
                    ]}
                    xAxis={[
                      {
                        data: cohortsByProgramData.map((d) => d.programName),
                        scaleType: 'band',
                        label: 'Program',
                      },
                    ]}
                    yAxis={[
                      {
                        label: 'Cohorts',
                      },
                    ]}
                    grid={{ vertical: true, horizontal: true }}
                  />
                </Box>
              ) : (
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
                    No cohort data available
                  </Typography>
                </Box>
              )}
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

