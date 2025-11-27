import React, { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, Chip } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useServices } from '@talendig/shared';
import type { Program, Module } from '@talendig/shared';
import { LoadingSpinner, PageHeader } from '@talendig/shared';
import { ProgramTimeline } from './ProgramTimeline';

export const ProgramDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { programsService, modulesService } = useServices();
  const [program, setProgram] = useState<Program | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProgram();
      loadModules();
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

  const loadModules = async () => {
    if (!id) return;
    try {
      const data = await modulesService.getByProgramId(id);
      setModules(data);
    } catch (error) {
      console.error('Error loading modules:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!program) {
    return <div>Program not found</div>;
  }

  return (
    <Box>
      <PageHeader
        title={program.name}
        subtitle={program.description}
        actions={
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/programs')}
          >
            Back
          </Button>
        }
      />
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Program Details
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Start Date
            </Typography>
            <Typography>{new Date(program.startDate).toLocaleDateString()}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              End Date
            </Typography>
            <Typography>{new Date(program.endDate).toLocaleDateString()}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Duration
            </Typography>
            <Typography>{program.durationMonths} months</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Status
            </Typography>
            <Chip
              label={program.status}
              color={program.status === 'active' ? 'success' : 'default'}
              size="small"
            />
          </Box>
        </Box>
      </Paper>
      <ProgramTimeline modules={modules} />
    </Box>
  );
};

