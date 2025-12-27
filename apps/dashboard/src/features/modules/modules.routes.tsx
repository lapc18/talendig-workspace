import React, { FC, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { PageHeader } from '@talendig/shared';
import { ModulesList } from './ModulesList';
import { ModuleDetail } from './ModuleDetail';
import { ModuleEditRoute } from './ModuleEditRoute';
import { ModuleForm } from './ModuleForm';

const ModuleCreateRoute: FC = () => {
  const [showForm, setShowForm] = useState(true);
  
  return (
    <Box>
      <PageHeader
        title="Create Module"
        subtitle="Add a new module to a program"
      />
      {showForm && (
        <ModuleForm
          onSuccess={() => {
            setShowForm(false);
            window.history.back();
          }}
          onCancel={() => {
            setShowForm(false);
            window.history.back();
          }}
        />
      )}
    </Box>
  );
};

export const ModulesRoutes: FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Box>
            <PageHeader
              title="Modules"
              subtitle="Manage program modules and assignments"
              actions={
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowForm(true)}
                >
                  Add Module
                </Button>
              }
            />
            {showForm ? (
              <ModuleForm
                onSuccess={() => {
                  setShowForm(false);
                }}
                onCancel={() => setShowForm(false)}
              />
            ) : (
              <ModulesList />
            )}
          </Box>
        }
      />
      <Route path="/create" element={<ModuleCreateRoute />} />
      <Route path="/:id/edit" element={<ModuleEditRoute />} />
      <Route path="/:id" element={<ModuleDetail />} />
    </Routes>
  );
};

