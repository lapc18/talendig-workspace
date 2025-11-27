import React, { FC, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Paper,
  Typography,
  Chip,
  Autocomplete,
} from '@mui/material';
import { useServices } from '@talendig/shared';
import type { Instructor, CreateInstructorInput } from '@talendig/shared';
import { CVUpload } from './CVUpload';

interface InstructorFormProps {
  instructor?: Instructor;
  onSuccess: () => void;
  onCancel: () => void;
}

const validationSchema = yup.object({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string(),
  shortBio: yup.string(),
  status: yup.string().oneOf(['active', 'inactive']).required('Status is required'),
  technologies: yup.array().of(yup.string()),
});

const commonTechnologies = [
  'React',
  'Node.js',
  'TypeScript',
  'JavaScript',
  'Python',
  'Java',
  'C#',
  '.NET',
  'Angular',
  'Vue.js',
  'MongoDB',
  'PostgreSQL',
  'Firebase',
  'AWS',
  'Docker',
  'Kubernetes',
];

export const InstructorForm: FC<InstructorFormProps> = ({
  instructor,
  onSuccess,
  onCancel,
}) => {
  const { instructorsService } = useServices();
  const [cvUrl, setCvUrl] = useState<string | undefined>(instructor?.cvUrl);
  const [cvPath, setCvPath] = useState<string | undefined>(instructor?.cvStoragePath);
  const isEdit = !!instructor;
  const instructorId = instructor?.id || 'new';

  const formik = useFormik<CreateInstructorInput & { technologies: string[] }>({
    initialValues: {
      fullName: instructor?.fullName || '',
      email: instructor?.email || '',
      phone: instructor?.phone || '',
      shortBio: instructor?.shortBio || '',
      status: instructor?.status || 'active',
      technologies: instructor?.technologies || [],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const data: CreateInstructorInput = {
          ...values,
          cvUrl,
          cvStoragePath: cvPath,
        };

        if (isEdit) {
          await instructorsService.update({ id: instructor.id, ...data });
        } else {
          await instructorsService.create(data);
        }
        onSuccess();
      } catch (error) {
        console.error('Error saving instructor:', error);
      }
    },
  });

  const handleCVUpload = (url: string, path: string) => {
    setCvUrl(url);
    setCvPath(path);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {isEdit ? 'Edit Instructor' : 'Create Instructor'}
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
          id="shortBio"
          name="shortBio"
          label="Short Bio"
          multiline
          rows={3}
          value={formik.values.shortBio}
          onChange={formik.handleChange}
          error={formik.touched.shortBio && Boolean(formik.errors.shortBio)}
          helperText={formik.touched.shortBio && formik.errors.shortBio}
          margin="normal"
        />
        <Autocomplete
          multiple
          freeSolo
          options={commonTechnologies}
          value={formik.values.technologies}
          onChange={(_, newValue) => {
            formik.setFieldValue('technologies', newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Technologies"
              margin="normal"
              placeholder="Add technologies"
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option}
                {...getTagProps({ index })}
                key={index}
              />
            ))
          }
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
          <Box sx={{ mt: 2 }}>
            <CVUpload
              instructorId={instructor.id}
              onUploadComplete={handleCVUpload}
              existingUrl={cvUrl}
            />
          </Box>
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

