import { FC, useEffect, useState, useCallback } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Paper,
  Typography,
  Alert,
} from '@mui/material';
import { useServices } from '@talendig/shared';
import type { Program, CreateProgramInput, Cohort } from '@talendig/shared';
import { addMonths, format } from 'date-fns';

interface ProgramFormProps {
  program?: Program;
  onSuccess: () => void;
  onCancel: () => void;
}

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  startDate: yup.date().required('Start date is required'),
  endDate: yup.date().required('End date is required'),
  durationMonths: yup
    .number()
    .required('Duration is required')
    .min(1, 'Must be at least 1 month')
    .max(12, 'Must be at most 12 months')
    .integer('Must be a whole number'),
  status: yup.string().oneOf(['active', 'inactive']).required('Status is required'),
  programType: yup.string(),
  cohortId: yup.string(),
});

export const ProgramForm: FC<ProgramFormProps> = ({
  program,
  onSuccess,
  onCancel,
}) => {
  const { programsService, modulesService, cohortsService } = useServices();
  const isEdit = !!program;
  const [linkedCohort, setLinkedCohort] = useState<Cohort | null>(null);
  const hasLinkedCohort = !!program?.cohortId;

  const loadLinkedCohort = useCallback(async () => {
    if (!program?.cohortId) return;
    try {
      const cohort = await cohortsService.getById(program.cohortId);
      setLinkedCohort(cohort);
    } catch (error) {
      console.error('Error loading linked cohort:', error);
    }
  }, [program?.cohortId, cohortsService]);

  useEffect(() => {
    if (program?.cohortId) {
      loadLinkedCohort();
    }
  }, [program?.cohortId, loadLinkedCohort]);

  const formik = useFormik<CreateProgramInput>({
    initialValues: {
      name: program?.name || '',
      description: program?.description || '',
      startDate: program?.startDate || format(new Date(), 'yyyy-MM-dd'),
      endDate: program?.endDate || format(addMonths(new Date(), 10), 'yyyy-MM-dd'),
      durationMonths: program?.durationMonths || 10,
      status: program?.status || 'active',
      programType: program?.programType || '',
      cohortId: program?.cohortId || undefined,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (isEdit) {
          await programsService.update({ id: program.id, ...values });
        } else {
          const newProgram = await programsService.create(values);
          // Auto-generate 10 modules
          await generateModules(newProgram.id, values.startDate, values.durationMonths);
        }
        onSuccess();
      } catch (error) {
        console.error('Error saving program:', error);
      }
    },
  });

  const generateModules = async (
    programId: string,
    startDate: string,
    durationMonths: number
  ) => {
    const start = new Date(startDate);
    for (let i = 0; i < durationMonths; i++) {
      const moduleStart = addMonths(start, i);
      const moduleEnd = addMonths(moduleStart, 1);
      
      await modulesService.create({
        programId,
        subjectId: '', // Will be assigned later
        instructorId: '', // Will be assigned later
        subjectSnapshot: '',
        instructorSnapshot: '',
        startDate: format(moduleStart, 'yyyy-MM-dd'),
        endDate: format(moduleEnd, 'yyyy-MM-dd'),
        hours: 24, // Default hours
        monthNumber: i + 1,
      });
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {isEdit ? 'Edit Program' : 'Create Program'}
      </Typography>
      {hasLinkedCohort && linkedCohort && (
        <Alert severity="info" sx={{ mb: 2 }}>
          This program is linked to cohort: <strong>{linkedCohort.name}</strong>
        </Alert>
      )}
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          id="programType"
          name="programType"
          label="Program Type"
          value={formik.values.programType}
          onChange={formik.handleChange}
          error={formik.touched.programType && Boolean(formik.errors.programType)}
          helperText={
            formik.touched.programType && formik.errors.programType
              ? formik.errors.programType
              : 'Template/type identifier (e.g., "Full-Stack Developer Program")'
          }
          margin="normal"
        />
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
        {hasLinkedCohort && (
          <TextField
            fullWidth
            id="cohortId"
            name="cohortId"
            label="Linked Cohort"
            value={linkedCohort?.name || program?.cohortId || ''}
            disabled
            helperText="This program is linked to a cohort. The link is managed through the cohort."
            margin="normal"
          />
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
    </Paper>
  );
};

