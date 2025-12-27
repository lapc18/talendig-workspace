import { FC, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { PageHeader } from '@talendig/shared';
import { InstructorsList } from './InstructorsList';
import { InstructorForm } from './InstructorForm';
import { InstructorDetail } from './InstructorDetail';

export const InstructorsRoutes: FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <Routes>
      <Route
        path="/"
        element={
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
        }
      />
      <Route path="/:id" element={<InstructorDetail />} />
    </Routes>
  );
};

