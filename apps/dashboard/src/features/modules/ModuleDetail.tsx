import React, { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  Chip,
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
import { LoadingSpinner, PageHeader } from '@talendig/shared';

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
      <Paper sx={{ p: 3, mb: 3 }}>
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
      </Paper>
      
      {(module.instructorId || module.subjectId) && (
        <Paper sx={{ p: 3, mb: 3 }}>
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
        </Paper>
      )}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Cohort Assignments
        </Typography>
        {assignments.length === 0 ? (
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            No cohort assignments found for this module.
          </Typography>
        ) : (
          <TableContainer sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Cohort</TableCell>
                  <TableCell>Instructor</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell>
                      {assignment.cohort ? (
                        <Link
                          component="button"
                          variant="body2"
                          onClick={() => navigate(`/cohorts/${assignment.cohort!.id}`)}
                          sx={{ cursor: 'pointer' }}
                        >
                          {assignment.cohort.name}
                        </Link>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Unknown
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {assignment.instructor ? (
                        <Typography variant="body2">
                          {assignment.instructor.fullName}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Unknown
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {assignment.subject ? (
                        <Typography variant="body2">
                          {assignment.subject.name} ({assignment.subject.code})
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Unknown
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={assignment.status}
                        color={assignment.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

