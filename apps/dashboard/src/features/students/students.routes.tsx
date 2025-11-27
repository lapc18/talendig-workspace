import React, { FC, useState } from 'react';
import { Box, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { PageHeader } from '@talendig/shared';
import { StudentsList } from './StudentsList';
import { StudentForm } from './StudentForm';

export const StudentsRoutes: FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <Box>
      <PageHeader
        title="Students"
        subtitle="Manage students and enrollments"
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowForm(true)}
          >
            Add Student
          </Button>
        }
      />
      {showForm ? (
        <StudentForm
          onSuccess={() => {
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <StudentsList />
      )}
    </Box>
  );
};

