import React, { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@talendig/shared';
import type { UserRole } from '@talendig/shared';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export const RoleGuard: FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

