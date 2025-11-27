import React, { FC } from 'react';
import { Box } from '@mui/material';
import { PageHeader } from '@talendig/shared';
import { ModulesList } from './ModulesList';

export const ModulesRoutes: FC = () => {
  return (
    <Box>
      <PageHeader
        title="Modules"
        subtitle="Manage program modules and assignments"
      />
      <ModulesList />
    </Box>
  );
};

