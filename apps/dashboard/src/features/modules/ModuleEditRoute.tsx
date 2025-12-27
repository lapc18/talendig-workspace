import React, { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useServices } from '@talendig/shared';
import { LoadingSpinner } from '@talendig/shared';
import type { Module } from '@talendig/shared';
import { ModuleForm } from './ModuleForm';

export const ModuleEditRoute: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { modulesService } = useServices();
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadModule();
    }
  }, [id]);

  const loadModule = async () => {
    if (!id) return;
    try {
      const data = await modulesService.getById(id);
      setModule(data);
    } catch (error) {
      console.error('Error loading module:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!module) {
    return <div>Module not found</div>;
  }

  return (
    <ModuleForm
      module={module}
      onSuccess={() => {
        navigate(`/modules/${id}`);
      }}
      onCancel={() => {
        navigate(`/modules/${id}`);
      }}
    />
  );
};

