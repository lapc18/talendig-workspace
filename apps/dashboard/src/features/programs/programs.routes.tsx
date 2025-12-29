import { FC, useState, useEffect } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { PageHeader } from '@talendig/shared';
import { ProgramsList } from './ProgramsList';
import { ProgramForm } from './ProgramForm';
import { ProgramDetail } from './ProgramDetail';
import { useServices } from '@talendig/shared';
import { LoadingSpinner } from '@talendig/shared';
import type { Program } from '@talendig/shared';

const ProgramEditRoute: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { programsService } = useServices();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProgram();
    }
  }, [id]);

  const loadProgram = async () => {
    if (!id) return;
    try {
      const data = await programsService.getById(id);
      setProgram(data);
    } catch (error) {
      console.error('Error loading program:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!program) {
    return <div>Program not found</div>;
  }

  return (
    <ProgramForm
      program={program}
      onSuccess={() => {
        navigate(`/programs/${id}`);
      }}
      onCancel={() => {
        navigate(`/programs/${id}`);
      }}
    />
  );
};

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
      <Route path="/:id/edit" element={<ProgramEditRoute />} />
      <Route path="/:id" element={<ProgramDetail />} />
    </Routes>
  );
};

