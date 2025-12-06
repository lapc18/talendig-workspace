import { FC } from 'react';
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
import type { Program, CreateProgramInput } from '@talendig/shared';

interface ProgramFormProps {
  program?: Program;
  onSuccess: () => void;
  onCancel: () => void;
}

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  type: yup.string().required('Type is required'),
  durationMonths: yup
    .number()
    .required('Duration is required')
    .min(1, 'Must be at least 1 month')
    .max(12, 'Must be at most 12 months')
    .integer('Must be a whole number'),
  status: yup.string().oneOf(['active', 'inactive']).required('Status is required'),
});

export const ProgramForm: FC<ProgramFormProps> = ({
  program,
  onSuccess,
  onCancel,
}) => {
  const { programsService, modulesService } = useServices();
  const isEdit = !!program;

  const formik = useFormik<CreateProgramInput>({
    initialValues: {
      name: program?.name || '',
      description: program?.description || '',
      type: program?.type || '',
      durationMonths: program?.durationMonths || 10,
      status: program?.status || 'active',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (isEdit) {
          await programsService.update({ id: program.id, ...values });
        } else {
          const newProgram = await programsService.create(values);
          // Auto-generate modules based on duration
          await generateModules(newProgram.id, values.durationMonths);
        }
        onSuccess();
      } catch (error) {
        console.error('Error saving program:', error);
      }
    },
  });

  const generateModules = async (programId: string, durationMonths: number) => {
    for (let i = 0; i < durationMonths; i++) {
      await modulesService.create({
        programId,
        month: i + 1,
        hours: 24, // Default hours
      });
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {isEdit ? 'Edit Program' : 'Create Program'}
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
          value={formik.values.type}
          onChange={formik.handleChange}
          error={formik.touched.type && Boolean(formik.errors.type)}
          helperText={formik.touched.type && formik.errors.type}
          margin="normal"
        />
        <TextField
          fullWidth
          id="durationMonths"
          name="durationMonths"
          label="Duration (Months)"
          type="number"
          value={formik.values.durationMonths}
          onChange={formik.handleChange}
          error={formik.touched.durationMonths && Boolean(formik.errors.durationMonths)}
          helperText={formik.touched.durationMonths && formik.errors.durationMonths}
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

