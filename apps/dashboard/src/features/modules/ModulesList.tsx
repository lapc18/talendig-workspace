import React, { FC, useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useServices } from '@talendig/shared';
import type { Module, Program } from '@talendig/shared';
import { LoadingSpinner } from '@talendig/shared';
import { Box } from '@mui/material';

export const ModulesList: FC = () => {
  const { modulesService, programsService } = useServices();
  const [modules, setModules] = useState<Module[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrograms();
  }, []);

  useEffect(() => {
    if (selectedProgramId) {
      loadModules();
    } else {
      loadAllModules();
    }
  }, [selectedProgramId]);

  const loadPrograms = async () => {
    try {
      const data = await programsService.getAll();
      setPrograms(data);
    } catch (error) {
      console.error('Error loading programs:', error);
    }
  };

  const loadModules = async () => {
    try {
      setLoading(true);
      const data = await modulesService.getByProgramId(selectedProgramId);
      setModules(data);
    } catch (error) {
      console.error('Error loading modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllModules = async () => {
    try {
      setLoading(true);
      const data = await modulesService.getAll();
      setModules(data);
    } catch (error) {
      console.error('Error loading modules:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      <FormControl fullWidth sx={{ mb: 2, maxWidth: 300 }}>
        <InputLabel>Filter by Program</InputLabel>
        <Select
          value={selectedProgramId}
          onChange={(e) => setSelectedProgramId(e.target.value)}
          label="Filter by Program"
        >
          <MenuItem value="">All Programs</MenuItem>
          {programs.map((program) => (
            <MenuItem key={program.id} value={program.id}>
              {program.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Month</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Instructor</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Hours</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {modules.map((module) => (
              <TableRow key={module.id}>
                <TableCell>Month {module.monthNumber}</TableCell>
                <TableCell>{module.subjectSnapshot || '-'}</TableCell>
                <TableCell>{module.instructorSnapshot || '-'}</TableCell>
                <TableCell>{new Date(module.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(module.endDate).toLocaleDateString()}</TableCell>
                <TableCell>{module.hours}h</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => console.log('Edit', module.id)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

