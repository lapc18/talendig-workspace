import React, { FC, useEffect } from 'react';
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
import type { Subject, CreateSubjectInput, UpdateSubjectInput } from '@talendig/shared';

interface SubjectFormProps {
  subject?: Subject;
  onSuccess: () => void;
  onCancel: () => void;
}

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  type: yup.string().required('Type is required'),
  code: yup.string().required('Code is required'),
  defaultHours: yup
    .number()
    .required('Default hours is required')
    .min(1, 'Must be at least 1 hour')
    .integer('Must be a whole number'),
  status: yup.string().oneOf(['active', 'inactive']).required('Status is required'),
});

export const SubjectForm: FC<SubjectFormProps> = ({
  subject,
  onSuccess,
  onCancel,
}) => {
  const { subjectsService } = useServices();
  const isEdit = !!subject;

  const formik = useFormik<CreateSubjectInput>({
    initialValues: {
      name: subject?.name || '',
      description: subject?.description || '',
      type: subject?.type || '',
      code: subject?.code || '',
      defaultHours: subject?.defaultHours || 24,
      status: subject?.status || 'active',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (isEdit) {
          await subjectsService.update({ id: subject.id, ...values });
        } else {
          await subjectsService.create(values);
        }
        onSuccess();
      } catch (error) {
        console.error('Error saving subject:', error);
      }
    },
  });

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {isEdit ? 'Edit Subject' : 'Create Subject'}
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
          id="description"
          name="description"
          label="Description"
          multiline
          rows={3}
          value={formik.values.description}
          onChange={formik.handleChange}
          error={formik.touched.description && Boolean(formik.errors.description)}
          helperText={formik.touched.description && formik.errors.description}
          margin="normal"
        />
        <TextField
          fullWidth
          id="type"
          name="type"
          label="Type"
          select
          value={formik.values.type}
          onChange={formik.handleChange}
          error={formik.touched.type && Boolean(formik.errors.type)}
          helperText={formik.touched.type && formik.errors.type}
          margin="normal"
        >
          <MenuItem value="Tech">Tech</MenuItem>
          <MenuItem value="Soft Skills">Soft Skills</MenuItem>
          <MenuItem value="Project">Project</MenuItem>
        </TextField>
        <TextField
          fullWidth
          id="code"
          name="code"
          label="Code"
          value={formik.values.code}
          onChange={formik.handleChange}
          error={formik.touched.code && Boolean(formik.errors.code)}
          helperText={formik.touched.code && formik.errors.code}
          margin="normal"
        />
        <TextField
          fullWidth
          id="defaultHours"
          name="defaultHours"
          label="Default Hours"
          type="number"
          value={formik.values.defaultHours}
          onChange={formik.handleChange}
          error={formik.touched.defaultHours && Boolean(formik.errors.defaultHours)}
          helperText={formik.touched.defaultHours && formik.errors.defaultHours}
          margin="normal"
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

