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
} from '@mui/material';
import { useServices } from '@talendig/shared';
import type { Student, CreateStudentInput, Cohort } from '@talendig/shared';
import { format } from 'date-fns';

interface StudentFormProps {
  student?: Student;
  cohortId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const validationSchema = yup.object({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string(),
  birthDate: yup.date().required('Birth date is required'),
  status: yup.string().oneOf(['active', 'inactive']).required('Status is required'),
  cohortId: yup.string().required('Cohort is required'),
});

export const StudentForm: FC<StudentFormProps> = ({
  student,
  cohortId: initialCohortId,
  onSuccess,
  onCancel,
}) => {
  const { studentsService, cohortsService } = useServices();
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const isEdit = !!student;

  useEffect(() => {
    loadCohorts();
  }, []);

  const loadCohorts = async () => {
    try {
      const data = await cohortsService.getAll();
      setCohorts(data);
    } catch (error) {
      console.error('Error loading cohorts:', error);
    }
  };

  const formik = useFormik<CreateStudentInput>({
    initialValues: {
      fullName: student?.fullName || '',
      email: student?.email || '',
      phone: student?.phone || '',
      birthDate: student?.birthDate || format(new Date('2000-01-01'), 'yyyy-MM-dd'),
      status: student?.status || 'active',
      cohortId: student?.cohortId || initialCohortId || '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (isEdit) {
          await studentsService.update({ id: student.id, ...values });
        } else {
          await studentsService.create(values);
        }
        onSuccess();
      } catch (error) {
        console.error('Error saving student:', error);
      }
    },
  });

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {isEdit ? 'Edit Student' : 'Create Student'}
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          id="fullName"
          name="fullName"
          label="Full Name"
          value={formik.values.fullName}
          onChange={formik.handleChange}
          error={formik.touched.fullName && Boolean(formik.errors.fullName)}
          helperText={formik.touched.fullName && formik.errors.fullName}
          margin="normal"
        />
        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          margin="normal"
        />
        <TextField
          fullWidth
          id="phone"
          name="phone"
          label="Phone"
          value={formik.values.phone}
          onChange={formik.handleChange}
          error={formik.touched.phone && Boolean(formik.errors.phone)}
          helperText={formik.touched.phone && formik.errors.phone}
          margin="normal"
        />
        <TextField
          fullWidth
          id="birthDate"
          name="birthDate"
          label="Birth Date"
          type="date"
          value={formik.values.birthDate}
          onChange={formik.handleChange}
          error={formik.touched.birthDate && Boolean(formik.errors.birthDate)}
          helperText={formik.touched.birthDate && formik.errors.birthDate}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          fullWidth
          id="cohortId"
          name="cohortId"
          label="Cohort"
          select
          value={formik.values.cohortId}
          onChange={formik.handleChange}
          error={formik.touched.cohortId && Boolean(formik.errors.cohortId)}
          helperText={formik.touched.cohortId && formik.errors.cohortId}
          margin="normal"
          disabled={!!initialCohortId}
        >
          {cohorts.map((cohort) => (
            <MenuItem key={cohort.id} value={cohort.id}>
              {cohort.name}
            </MenuItem>
          ))}
        </TextField>
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
        </TextField>
        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

