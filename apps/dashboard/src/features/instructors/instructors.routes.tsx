import React, { FC, useState } from 'react';
import { Box, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { PageHeader } from '@talendig/shared';
import { InstructorsList } from './InstructorsList';
import { InstructorForm } from './InstructorForm';

export const InstructorsRoutes: FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <Box>
      <PageHeader
        title="Instructors"
        subtitle="Manage instructors and their profiles"
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowForm(true)}
          >
            Add Instructor
          </Button>
        }
      />
      {showForm ? (
        <InstructorForm
          onSuccess={() => {
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <InstructorsList />
      )}
    </Box>
  );
};

