import React, { FC, useState, useEffect } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { PageHeader, useServices, LoadingSpinner } from '@talendig/shared';
import type { Student } from '@talendig/shared';
import { StudentsList } from './StudentsList';
import { StudentForm } from './StudentForm';
import { StudentDetail } from './StudentDetail';

const StudentEditRoute: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { studentsService } = useServices();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadStudent();
    }
  }, [id]);

  const loadStudent = async () => {
    if (!id) return;
    try {
      const data = await studentsService.getById(id);
      setStudent(data);
    } catch (error) {
      console.error('Error loading student:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!student) {
    return <div>Student not found</div>;
  }

  return (
    <StudentForm
      student={student}
      onSuccess={() => {
        navigate(`/students/${id}`);
      }}
      onCancel={() => {
        navigate(`/students/${id}`);
      }}
    />
  );
};

export const StudentsRoutes: FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <Routes>
      <Route
        path="/"
        element={
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
        }
      />
      <Route path="/:id/edit" element={<StudentEditRoute />} />
      <Route path="/:id" element={<StudentDetail />} />
    </Routes>
  );
};

