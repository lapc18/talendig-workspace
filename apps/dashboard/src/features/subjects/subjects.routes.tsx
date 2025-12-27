import React, { FC, useState, useEffect } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { PageHeader, useServices, LoadingSpinner } from '@talendig/shared';
import type { Subject } from '@talendig/shared';
import { SubjectsList } from './SubjectsList';
import { SubjectForm } from './SubjectForm';
import { SubjectDetail } from './SubjectDetail';

const SubjectEditRoute: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { subjectsService } = useServices();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadSubject();
    }
  }, [id]);

  const loadSubject = async () => {
    if (!id) return;
    try {
      const data = await subjectsService.getById(id);
      setSubject(data);
    } catch (error) {
      console.error('Error loading subject:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!subject) {
    return <div>Subject not found</div>;
  }

  return (
    <SubjectForm
      subject={subject}
      onSuccess={() => {
        navigate(`/subjects/${id}`);
      }}
      onCancel={() => {
        navigate(`/subjects/${id}`);
      }}
    />
  );
};

export const SubjectsRoutes: FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <Routes>
      <Route
        path="/"
        element={
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
                }}
                onCancel={() => setShowForm(false)}
              />
            ) : (
              <SubjectsList />
            )}
          </Box>
        }
      />
      <Route path="/:id/edit" element={<SubjectEditRoute />} />
      <Route path="/:id" element={<SubjectDetail />} />
    </Routes>
  );
};

