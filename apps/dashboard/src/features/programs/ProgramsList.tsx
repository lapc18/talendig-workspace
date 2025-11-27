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
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';
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
      setPrograms(data);
    } catch (error) {
      console.error('Error loading programs:', error);
    } finally {
      setLoading(false);
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
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Duration (Months)</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {programs.map((program) => (
            <TableRow key={program.id}>
              <TableCell>{program.name}</TableCell>
              <TableCell>{new Date(program.startDate).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(program.endDate).toLocaleDateString()}</TableCell>
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
                <IconButton size="small" onClick={() => console.log('Edit', program.id)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={() => console.log('Delete', program.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

