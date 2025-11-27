import React, { FC, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Paper,
  Typography,
  SelectChangeEvent,
} from '@mui/material';
import { useServices } from '@talendig/shared';
import type { Module, UpdateModuleInput, Subject, Instructor } from '@talendig/shared';
import { LoadingSpinner } from '@talendig/shared';

interface ModuleFormProps {
  module: Module;
  onSuccess: () => void;
  onCancel: () => void;
}

const validationSchema = yup.object({
  subjectId: yup.string().required('Subject is required'),
  instructorId: yup.string().required('Instructor is required'),
  hours: yup
    .number()
    .required('Hours is required')
    .min(1, 'Must be at least 1 hour')
    .integer('Must be a whole number'),
  startDate: yup.string().required('Start date is required'),
  endDate: yup.string().required('End date is required'),
});

export const ModuleForm: FC<ModuleFormProps> = ({
  module,
  onSuccess,
  onCancel,
}) => {
  const { modulesService, subjectsService, instructorsService } = useServices();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [subjectsData, instructorsData] = await Promise.all([
        subjectsService.getAll(),
        instructorsService.getAll(),
      ]);
      setSubjects(subjectsData);
      setInstructors(instructorsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik<UpdateModuleInput>({
    initialValues: {
      id: module.id,
      subjectId: module.subjectId || '',
      instructorId: module.instructorId || '',
      subjectSnapshot: module.subjectSnapshot || '',
      instructorSnapshot: module.instructorSnapshot || '',
      hours: module.hours || 24,
      startDate: module.startDate || '',
      endDate: module.endDate || '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await modulesService.update(values as UpdateModuleInput);
        onSuccess();
      } catch (error) {
        console.error('Error saving module:', error);
      }
    },
  });

  const handleSubjectChange = (event: SelectChangeEvent<string>) => {
    const subjectId = event.target.value;
    const selectedSubject = subjects.find((s) => s.id === subjectId);
    
    formik.setFieldValue('subjectId', subjectId);
    if (selectedSubject) {
      formik.setFieldValue('subjectSnapshot', selectedSubject.name);
      // Auto-update hours if subject has defaultHours
      if (selectedSubject.defaultHours) {
        formik.setFieldValue('hours', selectedSubject.defaultHours);
      }
    }
  };

  const handleInstructorChange = (event: SelectChangeEvent<string>) => {
    const instructorId = event.target.value;
    const selectedInstructor = instructors.find((i) => i.id === instructorId);
    
    formik.setFieldValue('instructorId', instructorId);
    if (selectedInstructor) {
      formik.setFieldValue('instructorSnapshot', selectedInstructor.fullName);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Edit Module - Month {module.monthNumber}
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          id="monthNumber"
          name="monthNumber"
          label="Month Number"
          value={module.monthNumber}
          disabled
          margin="normal"
        />
        <TextField
          fullWidth
          id="subjectId"
          name="subjectId"
          label="Subject"
          select
          value={formik.values.subjectId}
          onChange={handleSubjectChange}
          error={formik.touched.subjectId && Boolean(formik.errors.subjectId)}
          helperText={formik.touched.subjectId && formik.errors.subjectId}
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
          id="instructorId"
          name="instructorId"
          label="Instructor"
          select
          value={formik.values.instructorId}
          onChange={handleInstructorChange}
          error={formik.touched.instructorId && Boolean(formik.errors.instructorId)}
          helperText={formik.touched.instructorId && formik.errors.instructorId}
          margin="normal"
        >
          <MenuItem value="">Select an instructor</MenuItem>
          {instructors.map((instructor) => (
            <MenuItem key={instructor.id} value={instructor.id}>
              {instructor.fullName}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          id="hours"
          name="hours"
          label="Hours"
          type="number"
          value={formik.values.hours}
          onChange={formik.handleChange}
          error={formik.touched.hours && Boolean(formik.errors.hours)}
          helperText={formik.touched.hours && formik.errors.hours}
          margin="normal"
        />
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
        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Update
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

