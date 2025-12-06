import React, { FC } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
} from '@mui/material';
import { useServices } from '@talendig/shared';
import type { Module, UpdateModuleInput } from '@talendig/shared';

interface ModuleFormProps {
  module: Module;
  onSuccess: () => void;
  onCancel: () => void;
}

const validationSchema = yup.object({
  hours: yup
    .number()
    .required('Hours is required')
    .min(1, 'Must be at least 1 hour')
    .integer('Must be a whole number'),
});

export const ModuleForm: FC<ModuleFormProps> = ({
  module,
  onSuccess,
  onCancel,
}) => {
  const { modulesService } = useServices();

  const formik = useFormik<UpdateModuleInput>({
    initialValues: {
      id: module.id,
      hours: module.hours || 24,
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

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Edit Module - Month {module.month}
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          id="month"
          name="month"
          label="Month"
          value={module.month}
          disabled
          margin="normal"
        />
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

