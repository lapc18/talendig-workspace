import React, { FC, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { PageHeader } from '@talendig/shared';
import { SubjectsList } from './SubjectsList';
import { SubjectForm } from './SubjectForm';

export const SubjectsRoutes: FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  return (
    <Box>
      <PageHeader
        title="Subjects"
        subtitle="Manage academic subjects"
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowForm(true)}
          >
            Add Subject
          </Button>
        }
      />
      {showForm ? (
        <SubjectForm
          onSuccess={() => {
            setShowForm(false);
            // Reload list would happen here
          }}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <SubjectsList />
      )}
    </Box>
  );
};

