import { FC, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Card,
  Typography,
  Divider,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useServices } from '@talendig/shared';
import type { Cohort, CreateCohortInput, Program, Student } from '@talendig/shared';
import { format } from 'date-fns';

interface CohortFormProps {
  cohort?: Cohort;
  onSuccess: () => void;
  onCancel: () => void;
}

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  programId: yup.string().required('Program is required'),
  startDate: yup.date().required('Start date is required'),
  endDate: yup.date().required('End date is required'),
  status: yup.string().oneOf(['active', 'inactive', 'completed']).required('Status is required'),
});

export const CohortForm: FC<CohortFormProps> = ({
  cohort,
  onSuccess,
  onCancel,
}) => {
  const { cohortsService, programsService, studentsService } = useServices();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [cohortStudents, setCohortStudents] = useState<Student[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());
  const isEdit = !!cohort;

  useEffect(() => {
    loadPrograms();
    if (isEdit && cohort?.id) {
      loadStudents();
    } else {
      loadAllStudents();
    }
  }, [isEdit, cohort?.id]);

  const loadPrograms = async () => {
    try {
      const data = await programsService.getAll();
      setPrograms(data);
    } catch (error) {
      console.error('Error loading programs:', error);
    }
  };

  const loadAllStudents = async () => {
    try {
      const data = await studentsService.getAll();
      setAllStudents(data);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const loadStudents = async () => {
    if (!cohort?.id) return;
    try {
      const cohortStudentsData = await studentsService.getByCohortId(cohort.id);
      setCohortStudents(cohortStudentsData);
      setSelectedStudentIds(new Set(cohortStudentsData.map((s) => s.id)));
      
      // Also load all students for selection
      const allStudentsData = await studentsService.getAll();
      setAllStudents(allStudentsData);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const handleStudentToggle = (studentId: string) => {
    const newSelected = new Set(selectedStudentIds);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudentIds(newSelected);
  };

  const handleRemoveStudent = async (studentId: string) => {
    if (!window.confirm('Are you sure you want to remove this student from the cohort?')) return;
    try {
      const student = cohortStudents.find((s) => s.id === studentId);
      if (student) {
        await studentsService.update({
          id: studentId,
          cohortId: '', // Remove from cohort
        });
        await loadStudents();
      }
    } catch (error) {
      console.error('Error removing student:', error);
    }
  };

  const formik = useFormik<CreateCohortInput>({
    initialValues: {
      name: cohort?.name || '',
      programId: cohort?.programId || '',
      startDate: cohort?.startDate || format(new Date(), 'yyyy-MM-dd'),
      endDate: cohort?.endDate || format(new Date(), 'yyyy-MM-dd'),
      status: cohort?.status || 'active',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        let cohortId: string;
        if (isEdit) {
          await cohortsService.update({ id: cohort.id, ...values });
          cohortId = cohort.id;
        } else {
          const newCohort = await cohortsService.create(values);
          cohortId = newCohort.id;
        }
        
        // Update student assignments
        if (isEdit) {
          // Remove students that were deselected
          const removedStudents = cohortStudents.filter(
            (s) => !selectedStudentIds.has(s.id)
          );
          for (const student of removedStudents) {
            await studentsService.update({
              id: student.id,
              cohortId: '',
            });
          }
        }
        
        // Add newly selected students
        const studentsToAdd = allStudents.filter(
          (s) => selectedStudentIds.has(s.id) && s.cohortId !== cohortId
        );
        for (const student of studentsToAdd) {
          await studentsService.update({
            id: student.id,
            cohortId,
          });
        }
        
        onSuccess();
      } catch (error) {
        console.error('Error saving cohort:', error);
      }
    },
  });

  return (
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
        {isEdit ? 'Edit Cohort' : 'Create Cohort'}
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          id="name"
          name="name"
          label="Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          margin="normal"
        />
        <TextField
          fullWidth
          id="programId"
          name="programId"
          label="Program"
          select
          value={formik.values.programId}
          onChange={formik.handleChange}
          error={formik.touched.programId && Boolean(formik.errors.programId)}
          helperText={formik.touched.programId && formik.errors.programId}
          margin="normal"
        >
          {programs.map((program) => (
            <MenuItem key={program.id} value={program.id}>
              {program.name}
              {program.type ? ` (${program.type})` : ''}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          id="startDate"
          name="startDate"
          label="Start Date"
          type="date"
          value={formik.values.startDate}
          onChange={formik.handleChange}
          error={formik.touched.startDate && Boolean(formik.errors.startDate)}
          helperText={formik.touched.startDate && formik.errors.startDate}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          fullWidth
          id="endDate"
          name="endDate"
          label="End Date"
          type="date"
          value={formik.values.endDate}
          onChange={formik.handleChange}
          error={formik.touched.endDate && Boolean(formik.errors.endDate)}
          helperText={formik.touched.endDate && formik.errors.endDate}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          fullWidth
          id="status"
          name="status"
          label="Status"
          select
          value={formik.values.status}
          onChange={formik.handleChange}
          error={formik.touched.status && Boolean(formik.errors.status)}
          helperText={formik.touched.status && formik.errors.status}
          margin="normal"
        >
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </TextField>
        
        {isEdit && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" gutterBottom>
              Students ({selectedStudentIds.size})
            </Typography>
            
            {cohortStudents.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Current Students
                </Typography>
                <List>
                  {cohortStudents.map((student) => (
                    <ListItem
                      key={student.id}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveStudent(student.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedStudentIds.has(student.id)}
                            onChange={() => handleStudentToggle(student.id)}
                          />
                        }
                        label={student.fullName}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Available Students
              </Typography>
              <Box sx={{ maxHeight: 300, overflow: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1 }}>
                {allStudents
                  .filter((s) => !cohortStudents.find((cs) => cs.id === s.id))
                  .map((student) => (
                    <FormControlLabel
                      key={student.id}
                      control={
                        <Checkbox
                          checked={selectedStudentIds.has(student.id)}
                          onChange={() => handleStudentToggle(student.id)}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2">{student.fullName}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {student.email}
                          </Typography>
                        </Box>
                      }
                      sx={{ display: 'block', mb: 1 }}
                    />
                  ))}
                {allStudents.filter((s) => !cohortStudents.find((cs) => cs.id === s.id)).length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                    No available students
                  </Typography>
                )}
              </Box>
            </Box>
          </>
        )}
        
        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

