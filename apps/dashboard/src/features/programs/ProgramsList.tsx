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
  Chip,
  Link,
  Typography,
} from '@mui/material';
import { Edit as EditIcon, Block as BlockIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { useServices } from '@talendig/shared';
import type { Program } from '@talendig/shared';
import { LoadingSpinner } from '@talendig/shared';
import { useNavigate } from 'react-router-dom';

export const ProgramsList: FC = () => {
  const { programsService } = useServices();
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      const data = await programsService.getAll();
      // Filter out inactive programs
      const activePrograms = data.filter((program) => program.status === 'active');
      setPrograms(activePrograms);
    } catch (error) {
      console.error('Error loading programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id: string) => {
    if (window.confirm('Are you sure you want to deactivate this program?')) {
      try {
        await programsService.deactivate(id);
        loadPrograms();
      } catch (error) {
        console.error('Error deactivating program:', error);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Duration (Months)</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {programs.map((program) => (
            <TableRow key={program.id}>
              <TableCell>{program.name}</TableCell>
              <TableCell>
                {program.type ? (
                  <Typography variant="body2">{program.type}</Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    -
                  </Typography>
                )}
              </TableCell>
              <TableCell>{program.durationMonths}</TableCell>
              <TableCell>
                <Chip
                  label={program.status}
                  color={program.status === 'active' ? 'success' : 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <IconButton
                  size="small"
                  onClick={() => navigate(`/programs/${program.id}`)}
                >
                  <ViewIcon />
                </IconButton>
                <IconButton size="small" onClick={() => navigate(`/programs/${program.id}/edit`)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={() => handleDeactivate(program.id)}>
                  <BlockIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

