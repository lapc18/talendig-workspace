import React, { FC, useState, useEffect } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { PageHeader } from '@talendig/shared';
import { CohortsList } from './CohortsList';
import { CohortForm } from './CohortForm';
import { CohortDetail } from './CohortDetail';
import { useServices } from '@talendig/shared';
import { LoadingSpinner } from '@talendig/shared';
import type { Cohort } from '@talendig/shared';

const CohortEditRoute: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cohortsService } = useServices();
  const [cohort, setCohort] = useState<Cohort | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadCohort();
    }
  }, [id]);

  const loadCohort = async () => {
    if (!id) return;
    try {
      const data = await cohortsService.getById(id);
      setCohort(data);
    } catch (error) {
      console.error('Error loading cohort:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!cohort) {
    return <div>Cohort not found</div>;
  }

  return (
    <CohortForm
      cohort={cohort}
      onSuccess={() => {
        navigate(`/cohorts/${id}`);
      }}
      onCancel={() => {
        navigate(`/cohorts/${id}`);
      }}
    />
  );
};

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
      <Route path="/:id/edit" element={<CohortEditRoute />} />
      <Route path="/:id" element={<CohortDetail />} />
    </Routes>
  );
};

