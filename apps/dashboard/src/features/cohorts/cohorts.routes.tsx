import React, { FC, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { PageHeader } from '@talendig/shared';
import { CohortsList } from './CohortsList';
import { CohortForm } from './CohortForm';
import { CohortDetail } from './CohortDetail';

export const CohortsRoutes: FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Box>
            <PageHeader
              title="Cohorts"
              subtitle="Manage student cohorts"
              actions={
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowForm(true)}
                >
                  Add Cohort
                </Button>
              }
            />
            {showForm ? (
              <CohortForm
                onSuccess={() => {
                  setShowForm(false);
                }}
                onCancel={() => setShowForm(false)}
              />
            ) : (
              <CohortsList />
            )}
          </Box>
        }
      />
      <Route path="/:id" element={<CohortDetail />} />
    </Routes>
  );
};

