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
  Alert,
  IconButton,
  Divider,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useServices } from '@talendig/shared';
import type { Program, CreateProgramInput, Module, Instructor, Subject } from '@talendig/shared';

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
  const { programsService, modulesService, instructorsService, subjectsService } = useServices();
  const isEdit = !!program;
  const [hasModules, setHasModules] = useState(false);
  const [checkingModules, setCheckingModules] = useState(false);
  const [modules, setModules] = useState<Array<Module & { instructor?: Instructor; subject?: Subject }>>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingModules, setLoadingModules] = useState(false);
  const [updatingModules, setUpdatingModules] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isEdit && program?.id) {
      checkForModules();
      loadModules();
    }
    loadInstructorsAndSubjects();
  }, [isEdit, program?.id]);

  const loadInstructorsAndSubjects = async () => {
    try {
      const [instructorsData, subjectsData] = await Promise.all([
        instructorsService.getAll(),
        subjectsService.getAll(),
      ]);
      setInstructors(instructorsData.filter((i) => i.status === 'active'));
      setSubjects(subjectsData.filter((s) => s.status === 'active'));
    } catch (error) {
      console.error('Error loading instructors/subjects:', error);
    }
  };

  const loadModules = async () => {
    if (!program?.id) return;
    try {
      setLoadingModules(true);
      const modulesData = await modulesService.getByProgramId(program.id);
      
      const modulesWithDetails = await Promise.all(
        modulesData.map(async (module) => {
          const [instructor, subject] = await Promise.all([
            module.instructorId
              ? instructorsService.getById(module.instructorId).catch(() => null)
              : Promise.resolve(null),
            module.subjectId
              ? subjectsService.getById(module.subjectId).catch(() => null)
              : Promise.resolve(null),
          ]);
          
          return {
            ...module,
            instructor: instructor || undefined,
            subject: subject || undefined,
          };
        })
      );
      
      setModules(modulesWithDetails);
    } catch (error) {
      console.error('Error loading modules:', error);
    } finally {
      setLoadingModules(false);
    }
  };

  const updateModuleDetails = async (
    moduleId: string,
    field: 'instructorId' | 'subjectId',
    value: string
  ) => {
    // Fetch only the new instructor/subject details if value is provided
    const [instructor, subject] = await Promise.all([
      field === 'instructorId' && value
        ? instructorsService.getById(value).catch(() => null)
        : Promise.resolve(null),
      field === 'subjectId' && value
        ? subjectsService.getById(value).catch(() => null)
        : Promise.resolve(null),
    ]);

    // Update only the affected module in state
    setModules((prevModules) =>
      prevModules.map((module) => {
        if (module.id === moduleId) {
          return {
            ...module,
            [field]: value || undefined,
            // Clear instructor if instructorId is being cleared, otherwise update or keep existing
            instructor:
              field === 'instructorId'
                ? value
                  ? instructor || undefined
                  : undefined
                : module.instructor,
            // Clear subject if subjectId is being cleared, otherwise update or keep existing
            subject:
              field === 'subjectId'
                ? value
                  ? subject || undefined
                  : undefined
                : module.subject,
          };
        }
        return module;
      })
    );
  };

  const checkForModules = async () => {
    if (!program?.id) return;
    try {
      setCheckingModules(true);
      const hasModulesResult = await modulesService.hasModulesForProgram(program.id);
      setHasModules(hasModulesResult);
    } catch (error) {
      console.error('Error checking for modules:', error);
    } finally {
      setCheckingModules(false);
    }
  };

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
          // Prevent duration change if modules exist
          if (hasModules && values.durationMonths !== program.durationMonths) {
            formik.setFieldError(
              'durationMonths',
              'Cannot change duration when modules already exist for this program'
            );
            return;
          }
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

  const handleAddModule = async () => {
    if (!program?.id) return;
    try {
      const nextMonth = modules.length > 0 ? Math.max(...modules.map((m) => m.month)) + 1 : 1;
      await modulesService.create({
        programId: program.id,
        month: nextMonth,
        hours: 24,
      });
      await loadModules();
    } catch (error) {
      console.error('Error adding module:', error);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!window.confirm('Are you sure you want to delete this module?')) return;
    try {
      await modulesService.delete(moduleId);
      await loadModules();
    } catch (error) {
      console.error('Error deleting module:', error);
    }
  };

  const handleUpdateModule = async (
    moduleId: string,
    field: 'instructorId' | 'subjectId' | 'hours',
    value: string | number
  ) => {
    // Find the current module state for rollback
    const currentModule = modules.find((m) => m.id === moduleId);
    if (!currentModule) return;

    // Store previous values for rollback
    const previousValue = currentModule[field];
    const previousInstructor = currentModule.instructor;
    const previousSubject = currentModule.subject;

    // 1. Optimistically update local state
    setModules((prevModules) =>
      prevModules.map((module) => {
        if (module.id === moduleId) {
          return {
            ...module,
            [field]: value,
            // Clear instructor/subject if field is being cleared
            instructor: field === 'instructorId' && !value ? undefined : module.instructor,
            subject: field === 'subjectId' && !value ? undefined : module.subject,
          };
        }
        return module;
      })
    );

    // 2. Mark module as updating
    setUpdatingModules((prev) => new Set(prev).add(moduleId));

    try {
      // 3. Update database in background
      await modulesService.update({
        id: moduleId,
        [field]: value,
      });

      // 4. Fetch new details if instructor/subject changed
      if (field === 'instructorId' || field === 'subjectId') {
        await updateModuleDetails(moduleId, field, value as string);
      }
    } catch (error) {
      // 5. Handle errors with rollback
      console.error('Error updating module:', error);
      
      // Rollback optimistic update
      setModules((prevModules) =>
        prevModules.map((module) => {
          if (module.id === moduleId) {
            return {
              ...module,
              [field]: previousValue,
              instructor: previousInstructor,
              subject: previousSubject,
            };
          }
          return module;
        })
      );

      // Show error to user (could be enhanced with a toast notification)
      alert(`Failed to update module. Please try again.`);
    } finally {
      // Remove updating state
      setUpdatingModules((prev) => {
        const next = new Set(prev);
        next.delete(moduleId);
        return next;
      });
    }
  };

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
        {hasModules && isEdit && (
          <Alert severity="info" sx={{ mb: 2 }}>
            This program has existing modules. Duration cannot be changed.
          </Alert>
        )}
        <TextField
          fullWidth
          id="durationMonths"
          name="durationMonths"
          label="Duration (Months)"
          type="number"
          value={formik.values.durationMonths}
          onChange={formik.handleChange}
          error={formik.touched.durationMonths && Boolean(formik.errors.durationMonths)}
          helperText={
            formik.touched.durationMonths && formik.errors.durationMonths
              ? formik.errors.durationMonths
              : hasModules && isEdit
                ? 'Duration cannot be changed when modules exist'
                : undefined
          }
          disabled={hasModules && isEdit}
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Modules ({modules.length})</Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleAddModule}
              >
                Add Module
              </Button>
            </Box>
            
            {loadingModules ? (
              <Typography>Loading modules...</Typography>
            ) : modules.length === 0 ? (
              <Alert severity="info">No modules yet. Click "Add Module" to create one.</Alert>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {modules.map((module) => (
                  <Card
                    key={module.id}
                    sx={{
                      p: 2,
                      borderRadius: 2, // lg
                      border: (theme) =>
                        `1px solid ${theme.palette.mode === 'light' ? '#e2e8f0' : '#1f2937'}`,
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'light' ? '#ffffff' : '#0f172a',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Month {module.month}
                        </Typography>
                        {updatingModules.has(module.id) && (
                          <CircularProgress size={16} sx={{ color: 'primary.main' }} />
                        )}
                      </Box>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteModule(module.id)}
                        disabled={updatingModules.has(module.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <TextField
                        label="Hours"
                        type="number"
                        size="small"
                        value={module.hours}
                        onChange={(e) => handleUpdateModule(module.id, 'hours', parseInt(e.target.value) || 0)}
                        disabled={updatingModules.has(module.id)}
                        sx={{ minWidth: 120 }}
                      />
                      
                      <TextField
                        label="Instructor"
                        select
                        size="small"
                        value={module.instructorId || ''}
                        onChange={(e) => handleUpdateModule(module.id, 'instructorId', e.target.value)}
                        disabled={updatingModules.has(module.id)}
                        sx={{ minWidth: 200 }}
                      >
                        <MenuItem value="">None</MenuItem>
                        {instructors.map((instructor) => (
                          <MenuItem key={instructor.id} value={instructor.id}>
                            {instructor.fullName}
                          </MenuItem>
                        ))}
                      </TextField>
                      
                      <TextField
                        label="Subject"
                        select
                        size="small"
                        value={module.subjectId || ''}
                        onChange={(e) => handleUpdateModule(module.id, 'subjectId', e.target.value)}
                        disabled={updatingModules.has(module.id)}
                        sx={{ minWidth: 200 }}
                      >
                        <MenuItem value="">None</MenuItem>
                        {subjects.map((subject) => (
                          <MenuItem key={subject.id} value={subject.id}>
                            {subject.name} ({subject.code})
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>
                    
                    {(module.instructor || module.subject) && (
                      <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {module.instructor && (
                          <Chip label={`Instructor: ${module.instructor.fullName}`} size="small" />
                        )}
                        {module.subject && (
                          <Chip label={`Subject: ${module.subject.name}`} size="small" />
                        )}
                      </Box>
                    )}
                  </Card>
                ))}
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
    </Card>
  );
};

