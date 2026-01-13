import { FC, useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { useServices } from '@talendig/shared';
import type {
  Module,
  Subject,
  Instructor,
  CohortModuleAssignment,
} from '@talendig/shared';
import { LoadingSpinner } from '@talendig/shared';

interface CohortModuleAssignmentsProps {
  cohortId: string;
  programId: string;
}

export const CohortModuleAssignments: FC<CohortModuleAssignmentsProps> = ({
  cohortId,
  programId,
}) => {
  const {
    modulesService,
    subjectsService,
    instructorsService,
    cohortModuleAssignmentsService,
  } = useServices();
  const [modules, setModules] = useState<Module[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [assignments, setAssignments] = useState<CohortModuleAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [cohortId, programId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [modulesData, subjectsData, instructorsData, assignmentsData] =
        await Promise.all([
          modulesService.getByProgramId(programId),
          subjectsService.getAll(),
          instructorsService.getAll(),
          cohortModuleAssignmentsService.getByCohortId(cohortId),
        ]);
      setModules(modulesData);
      setSubjects(subjectsData);
      setInstructors(instructorsData);
      setAssignments(assignmentsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAssignmentForModule = (moduleId: string): CohortModuleAssignment | undefined => {
    return assignments.find((a) => a.moduleId === moduleId && a.status === 'active');
  };

  const handleSubjectChange = async (
    moduleId: string,
    event: SelectChangeEvent<string>
  ) => {
    const subjectId = event.target.value;
    const existingAssignment = getAssignmentForModule(moduleId);

    try {
      if (existingAssignment) {
        // Update existing assignment
        await cohortModuleAssignmentsService.update({
          id: existingAssignment.id,
          subjectId: subjectId || undefined,
        });
      } else {
        // Create new assignment - instructor is optional
        await cohortModuleAssignmentsService.create({
          cohortId,
          moduleId,
          subjectId: subjectId || undefined,
        });
      }
      await loadData();
    } catch (error) {
      console.error('Error updating assignment:', error);
    }
  };

  const handleInstructorChange = async (
    moduleId: string,
    event: SelectChangeEvent<string>
  ) => {
    const instructorId = event.target.value;
    const existingAssignment = getAssignmentForModule(moduleId);

    try {
      if (existingAssignment) {
        // Update existing assignment
        await cohortModuleAssignmentsService.update({
          id: existingAssignment.id,
          instructorId: instructorId || undefined,
        });
      } else {
        // Create new assignment - subject is optional
        await cohortModuleAssignmentsService.create({
          cohortId,
          moduleId,
          instructorId: instructorId || undefined,
        });
      }
      await loadData();
    } catch (error) {
      console.error('Error updating assignment:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Module Assignments
      </Typography>
      <Box sx={{ mt: 2 }}>
        {modules.length === 0 ? (
          <Typography color="text.secondary">No modules available for this program</Typography>
        ) : (
          modules.map((module) => {
            const assignment = getAssignmentForModule(module.id);
            return (
              <Box
                key={module.id}
                sx={{
                  p: 2,
                  mb: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                }}
              >
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ minWidth: 100 }}>
                    Month {module.month}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {module.hours} hours
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <TextField
                    fullWidth
                    select
                    label="Subject"
                    value={assignment?.subjectId || ''}
                    onChange={(e) => handleSubjectChange(module.id, e as SelectChangeEvent<string>)}
                    margin="normal"
                  >
                    <MenuItem value="">Select a subject</MenuItem>
                    {subjects.map((subject) => (
                      <MenuItem key={subject.id} value={subject.id}>
                        {subject.name} ({subject.code})
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    fullWidth
                    select
                    label="Instructor"
                    value={assignment?.instructorId || ''}
                    onChange={(e) =>
                      handleInstructorChange(module.id, e as SelectChangeEvent<string>)
                    }
                    margin="normal"
                  >
                    <MenuItem value="">Select an instructor</MenuItem>
                    {instructors.map((instructor) => (
                      <MenuItem key={instructor.id} value={instructor.id}>
                        {instructor.fullName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              </Box>
            );
          })
        )}
      </Box>
    </Paper>
  );
};

