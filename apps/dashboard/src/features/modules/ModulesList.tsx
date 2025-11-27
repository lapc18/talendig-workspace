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
  Dialog,
  DialogTitle,
  DialogContent,
  Link,
  Typography,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useServices } from '@talendig/shared';
import type { Module, Program } from '@talendig/shared';
import { LoadingSpinner } from '@talendig/shared';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ModuleForm } from './ModuleForm';

interface ModuleWithProgram extends Module {
  program?: Program;
}

export const ModulesList: FC = () => {
  const { modulesService, programsService } = useServices();
  const navigate = useNavigate();
  const [modules, setModules] = useState<ModuleWithProgram[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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
      // Load program information for each module
      const modulesWithPrograms = await Promise.all(
        data.map(async (module) => {
          if (module.programId) {
            try {
              const program = await programsService.getById(module.programId);
              return { ...module, program: program || undefined };
            } catch (error) {
              console.error(`Error loading program for module ${module.id}:`, error);
              return module;
            }
          }
          return module;
        })
      );
      setModules(modulesWithPrograms);
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
      // Load program information for each module
      const modulesWithPrograms = await Promise.all(
        data.map(async (module) => {
          if (module.programId) {
            try {
              const program = await programsService.getById(module.programId);
              return { ...module, program: program || undefined };
            } catch (error) {
              console.error(`Error loading program for module ${module.id}:`, error);
              return module;
            }
          }
          return module;
        })
      );
      setModules(modulesWithPrograms);
    } catch (error) {
      console.error('Error loading modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (module: Module) => {
    setEditingModule(module);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingModule(null);
  };

  const handleUpdateSuccess = () => {
    handleDialogClose();
    if (selectedProgramId) {
      loadModules();
    } else {
      loadAllModules();
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
              <TableCell>Program</TableCell>
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
                <TableCell>
                  {module.program ? (
                    <Link
                      component="button"
                      variant="body2"
                      onClick={() => navigate(`/programs/${module.program!.id}`)}
                      sx={{ cursor: 'pointer' }}
                    >
                      {module.program.name}
                    </Link>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Not linked
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{module.subjectSnapshot || '-'}</TableCell>
                <TableCell>{module.instructorSnapshot || '-'}</TableCell>
                <TableCell>{new Date(module.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(module.endDate).toLocaleDateString()}</TableCell>
                <TableCell>{module.hours}h</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleEditClick(module)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Module</DialogTitle>
        <DialogContent>
          {editingModule && (
            <ModuleForm
              module={editingModule}
              onSuccess={handleUpdateSuccess}
              onCancel={handleDialogClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

