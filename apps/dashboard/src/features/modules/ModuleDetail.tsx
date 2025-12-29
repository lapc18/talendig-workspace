import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Typography,
  Button,
  Link,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon } from '@mui/icons-material';
import { useServices } from '@talendig/shared';
import type {
  Module,
  Program,
  Cohort,
  CohortModuleAssignment,
  Instructor,
  Subject,
} from '@talendig/shared';
import { LoadingSpinner, PageHeader, StatusChip } from '@talendig/shared';

interface AssignmentWithDetails extends CohortModuleAssignment {
  cohort?: Cohort;
  instructor?: Instructor;
  subject?: Subject;
}

export const ModuleDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    modulesService,
    programsService,
    cohortModuleAssignmentsService,
    cohortsService,
    instructorsService,
    subjectsService,
  } = useServices();
  const [module, setModule] = useState<Module | null>(null);
  const [program, setProgram] = useState<Program | null>(null);
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [assignments, setAssignments] = useState<AssignmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadModule();
      loadAssignments();
    }
  }, [id]);

  const loadModule = async () => {
    if (!id) return;
    try {
      const data = await modulesService.getById(id);
      setModule(data);
      if (data?.programId) {
        const programData = await programsService.getById(data.programId);
        setProgram(programData);
      }
      if (data?.instructorId) {
        try {
          const instructorData = await instructorsService.getById(data.instructorId);
          setInstructor(instructorData);
        } catch (error) {
          console.error('Error loading instructor:', error);
        }
      }
      if (data?.subjectId) {
        try {
          const subjectData = await subjectsService.getById(data.subjectId);
          setSubject(subjectData);
        } catch (error) {
          console.error('Error loading subject:', error);
        }
      }
    } catch (error) {
      console.error('Error loading module:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAssignments = async () => {
    if (!id) return;
    try {
      const assignmentsData = await cohortModuleAssignmentsService.getByModuleId(id);
      // Filter only active assignments
      const activeAssignments = assignmentsData.filter((a) => a.status === 'active');

      // Load related data for each assignment
      const assignmentsWithDetails = await Promise.all(
        activeAssignments.map(async (assignment) => {
          const [cohort, instructor, subject] = await Promise.all([
            cohortsService.getById(assignment.cohortId).catch(() => null),
            instructorsService.getById(assignment.instructorId).catch(() => null),
            subjectsService.getById(assignment.subjectId).catch(() => null),
          ]);

          return {
            ...assignment,
            cohort: cohort || undefined,
            instructor: instructor || undefined,
            subject: subject || undefined,
          };
        })
      );

      setAssignments(assignmentsWithDetails);
    } catch (error) {
      console.error('Error loading assignments:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!module) {
    return <div>Module not found</div>;
  }

  return (
    <Box>
      <PageHeader
        title={`Module - Month ${module.month}`}
        subtitle={program ? `Part of ${program.name}` : 'Module details'}
        actions={
          <>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/modules/${id}/edit`)}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/modules')}
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
          Module Details
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Month
            </Typography>
            <Typography>Month {module.month}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Hours
            </Typography>
            <Typography>{module.hours} hours</Typography>
          </Box>
          {program && (
            <Box>
              <Typography variant="body2" color="text.secondary">
                Program
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
          {module.startDate && (
            <Box>
              <Typography variant="body2" color="text.secondary">
                Start Date
              </Typography>
              <Typography>{new Date(module.startDate).toLocaleDateString()}</Typography>
            </Box>
          )}
          {module.endDate && (
            <Box>
              <Typography variant="body2" color="text.secondary">
                End Date
              </Typography>
              <Typography>{new Date(module.endDate).toLocaleDateString()}</Typography>
            </Box>
          )}
        </Box>
      </Card>
      
      {(module.instructorId || module.subjectId) && (
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
            Assignments
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
            {module.instructorId && (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Instructor
                </Typography>
                {instructor ? (
                  <Link
                    component="button"
                    variant="body1"
                    onClick={() => navigate(`/instructors/${instructor.id}`)}
                    sx={{ cursor: 'pointer' }}
                  >
                    {instructor.fullName}
                  </Link>
                ) : (
                  <Typography>Loading instructor...</Typography>
                )}
              </Box>
            )}
            {module.subjectId && (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Subject
                </Typography>
                {subject ? (
                  <Link
                    component="button"
                    variant="body1"
                    onClick={() => navigate(`/subjects/${subject.id}`)}
                    sx={{ cursor: 'pointer' }}
                  >
                    {subject.name} ({subject.code})
                  </Link>
                ) : (
                  <Typography>Loading subject...</Typography>
                )}
              </Box>
            )}
          </Box>
        </Card>
      )}
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
          Cohort Assignments
        </Typography>
        {assignments.length === 0 ? (
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            No cohort assignments found for this module.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            {assignments.map((assignment) => (
              <Card
                key={assignment.id}
                sx={{
                  p: 2,
                  borderRadius: 2, // lg
                  border: (theme) =>
                    `1px solid ${theme.palette.mode === 'light' ? '#e2e8f0' : '#1f2937'}`,
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'light' ? '#ffffff' : '#0f172a',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {assignment.cohort?.name || 'Unknown Cohort'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Instructor: {assignment.instructor?.fullName || 'Unknown'} | Subject: {assignment.subject?.name || 'Unknown'}
                  </Typography>
                </Box>
                <StatusChip status={assignment.status} />
              </Card>
            ))}
          </Box>
        )}
      </Card>
    </Box>
  );
};

