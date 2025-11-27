import React, { FC } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AuthGuard } from '../features/auth/AuthGuard';
import { LoginPage } from '../features/auth/LoginPage';
import { SubjectsRoutes } from '../features/subjects/subjects.routes';
import { ProgramsRoutes } from '../features/programs/programs.routes';
import { InstructorsRoutes } from '../features/instructors/instructors.routes';
import { CohortsRoutes } from '../features/cohorts/cohorts.routes';
import { StudentsRoutes } from '../features/students/students.routes';
import { ModulesRoutes } from '../features/modules/modules.routes';
import { DashboardPage } from '../features/dashboard/DashboardPage';

export const AppRoutes: FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <AuthGuard>
            <MainLayout>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/programs/*" element={<ProgramsRoutes />} />
                <Route path="/modules" element={<ModulesRoutes />} />
                <Route path="/cohorts/*" element={<CohortsRoutes />} />
                <Route path="/students" element={<StudentsRoutes />} />
                <Route path="/instructors" element={<InstructorsRoutes />} />
                <Route path="/subjects" element={<SubjectsRoutes />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </MainLayout>
          </AuthGuard>
        }
      />
    </Routes>
  );
};

