import React, { FC } from 'react';
import { Box, Paper, Typography, Chip } from '@mui/material';
import type { Module } from '@talendig/shared';

interface ProgramTimelineProps {
  modules: Module[];
}

export const ProgramTimeline: FC<ProgramTimelineProps> = ({ modules }) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Program Timeline
      </Typography>
      <Box sx={{ mt: 2 }}>
        {modules.length === 0 ? (
          <Typography color="text.secondary">No modules assigned yet</Typography>
        ) : (
          modules.map((module) => (
            <Box
              key={module.id}
              sx={{
                p: 2,
                mb: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1">
                  Month {module.monthNumber}
                </Typography>
                <Chip label={`${module.hours}h`} size="small" />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {new Date(module.startDate).toLocaleDateString()} -{' '}
                {new Date(module.endDate).toLocaleDateString()}
              </Typography>
              {module.subjectSnapshot && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Subject: {module.subjectSnapshot}
                </Typography>
              )}
              {module.instructorSnapshot && (
                <Typography variant="body2" color="text.secondary">
                  Instructor: {module.instructorSnapshot}
                </Typography>
              )}
            </Box>
          ))
        )}
      </Box>
    </Paper>
  );
};

