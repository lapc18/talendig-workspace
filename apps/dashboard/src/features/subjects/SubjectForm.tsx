import { FC, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Paper,
  Typography,
  Divider,
  Chip,
  Alert,
} from '@mui/material';
import { useServices } from '@talendig/shared';
import type { Subject, CreateSubjectInput, UpdateSubjectInput, Module, Program } from '@talendig/shared';
import { useNavigate } from 'react-router-dom';

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
  const { subjectsService, modulesService, programsService } = useServices();
  const navigate = useNavigate();
  const isEdit = !!subject;
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(false);

  useEffect(() => {
    if (isEdit && subject?.id) {
      loadPrograms();
    }
  }, [isEdit, subject?.id]);

  const loadPrograms = async () => {
    if (!subject?.id) return;
    try {
      setLoadingPrograms(true);
      const allModules = await modulesService.getAll();
      const modulesWithSubject = allModules.filter((m) => m.subjectId === subject.id);
      const programIds = new Set(modulesWithSubject.map((m) => m.programId));
      
      const programsData = await Promise.all(
        Array.from(programIds).map((programId) =>
          programsService.getById(programId).catch(() => null)
        )
      );
      
      setPrograms(programsData.filter((p): p is Program => !!p));
    } catch (error) {
      console.error('Error loading programs:', error);
    } finally {
      setLoadingPrograms(false);
    }
  };

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
        
        {isEdit && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" gutterBottom>
              Programs Using This Subject ({programs.length})
            </Typography>
            {loadingPrograms ? (
              <Typography variant="body2" color="text.secondary">
                Loading programs...
              </Typography>
            ) : programs.length === 0 ? (
              <Alert severity="info">
                This subject is not currently assigned to any programs. Assign subjects to programs through modules.
              </Alert>
            ) : (
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {programs.map((program) => (
                    <Chip
                      key={program.id}
                      label={program.name}
                      onClick={() => navigate(`/programs/${program.id}`)}
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>
                <Alert severity="info" sx={{ mt: 2 }}>
                  Note: Subject assignment to programs is managed through modules. 
                  To assign this subject to a program, edit the program's modules.
                </Alert>
              </Box>
            )}
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
    </Paper>
  );
};

