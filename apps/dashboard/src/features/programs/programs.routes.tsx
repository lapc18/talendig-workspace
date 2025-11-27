import React, { FC, useState } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { PageHeader } from '@talendig/shared';
import { ProgramsList } from './ProgramsList';
import { ProgramForm } from './ProgramForm';
import { ProgramDetail } from './ProgramDetail';

export const ProgramsRoutes: FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Box>
            <PageHeader
              title="Programs"
              subtitle="Manage academic programs"
              actions={
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowForm(true)}
                >
                  Add Program
                </Button>
              }
            />
            {showForm ? (
              <ProgramForm
                onSuccess={() => {
                  setShowForm(false);
                }}
                onCancel={() => setShowForm(false)}
              />
            ) : (
              <ProgramsList />
            )}
          </Box>
        }
      />
      <Route path="/:id" element={<ProgramDetail />} />
    </Routes>
  );
};

