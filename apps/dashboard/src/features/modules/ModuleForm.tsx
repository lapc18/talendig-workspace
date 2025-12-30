import { FC, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Box,
  TextField,
  Button,
  Card,
  Typography,
  MenuItem,
} from '@mui/material';
import { useServices } from '@talendig/shared';
import type { Module, CreateModuleInput, UpdateModuleInput, Program, Instructor, Subject } from '@talendig/shared';

interface ModuleFormProps {
  module?: Module;
  programId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const validationSchema = yup.object({
  programId: yup.string().required('Program is required'),
  month: yup
    .number()
    .required('Month is required')
    .min(1, 'Must be at least 1')
    .integer('Must be a whole number'),
  hours: yup
    .number()
    .required('Hours is required')
    .min(1, 'Must be at least 1 hour')
    .integer('Must be a whole number'),
  instructorId: yup.string(),
  subjectId: yup.string(),
  startDate: yup.string(),
  endDate: yup.string(),
});

export const ModuleForm: FC<ModuleFormProps> = ({
  module,
  programId: initialProgramId,
  onSuccess,
  onCancel,
}) => {
  const { modulesService, programsService, instructorsService, subjectsService } = useServices();
  const isEdit = !!module;
  const [programs, setPrograms] = useState<Program[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [programsData, instructorsData, subjectsData] = await Promise.all([
        programsService.getAll(),
        instructorsService.getAll(),
        subjectsService.getAll(),
      ]);
      setPrograms(programsData.filter(p => p.status === 'active'));
      setInstructors(instructorsData.filter((i) => i.status === 'active'));
      setSubjects(subjectsData.filter((s) => s.status === 'active'));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const formik = useFormik<CreateModuleInput>({
    initialValues: {
      programId: module?.programId || initialProgramId || '',
      month: module?.month || 1,
      hours: module?.hours || 24,
      instructorId: module?.instructorId || '',
      subjectId: module?.subjectId || '',
      startDate: module?.startDate || '',
      endDate: module?.endDate || '',
      status: module?.status || 'active',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (isEdit && module) {
          await modulesService.update({ id: module.id, ...values } as UpdateModuleInput);
        } else {
          await modulesService.create(values);
        }
        onSuccess();
      } catch (error) {
        console.error('Error saving module:', error);
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
        {isEdit ? `Edit Module - Month ${module.month}` : 'Create Module'}
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
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
          disabled={isEdit || !!initialProgramId}
        >
          {programs.map((program) => (
            <MenuItem key={program.id} value={program.id}>
              {program.name} {program.type ? `(${program.type})` : ''}
            </MenuItem>
          ))}
        </TextField>
        
        <TextField
          fullWidth
          id="month"
          name="month"
          label="Month"
          type="number"
          value={formik.values.month}
          onChange={formik.handleChange}
          error={formik.touched.month && Boolean(formik.errors.month)}
          helperText={formik.touched.month && formik.errors.month}
          margin="normal"
          disabled={isEdit}
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
        
        <TextField
          fullWidth
          id="instructorId"
          name="instructorId"
          label="Instructor"
          select
          value={formik.values.instructorId}
          onChange={formik.handleChange}
          error={formik.touched.instructorId && Boolean(formik.errors.instructorId)}
          helperText={formik.touched.instructorId && formik.errors.instructorId}
          margin="normal"
        >
          <MenuItem value="">None</MenuItem>
          {instructors.map((instructor) => (
            <MenuItem key={instructor.id} value={instructor.id}>
              {instructor.fullName}
            </MenuItem>
          ))}
        </TextField>
        
        <TextField
          fullWidth
          id="subjectId"
          name="subjectId"
          label="Subject"
          select
          value={formik.values.subjectId}
          onChange={formik.handleChange}
          error={formik.touched.subjectId && Boolean(formik.errors.subjectId)}
          helperText={formik.touched.subjectId && formik.errors.subjectId}
          margin="normal"
        >
          <MenuItem value="">None</MenuItem>
          {subjects.map((subject) => (
            <MenuItem key={subject.id} value={subject.id}>
              {subject.name} ({subject.code})
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

