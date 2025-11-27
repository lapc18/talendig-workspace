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
import type { Cohort, CreateCohortInput, Program } from '@talendig/shared';
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
  const { cohortsService, programsService } = useServices();
  const [programs, setPrograms] = useState<Program[]>([]);
  const isEdit = !!cohort;

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      const data = await programsService.getAll();
      setPrograms(data);
    } catch (error) {
      console.error('Error loading programs:', error);
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
        if (isEdit) {
          await cohortsService.update({ id: cohort.id, ...values });
        } else {
          await cohortsService.create(values);
        }
        onSuccess();
      } catch (error) {
        console.error('Error saving cohort:', error);
      }
    },
  });

  return (
    <Paper sx={{ p: 3 }}>
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

