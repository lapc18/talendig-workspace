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
import type { Cohort } from '@talendig/shared';
import { LoadingSpinner } from '@talendig/shared';
import { useNavigate } from 'react-router-dom';

export const CohortsList: FC = () => {
  const { cohortsService } = useServices();
  const navigate = useNavigate();
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCohorts();
  }, []);

  const loadCohorts = async () => {
    try {
      setLoading(true);
      const data = await cohortsService.getAll();
      setCohorts(data);
    } catch (error) {
      console.error('Error loading cohorts:', error);
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
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cohorts.map((cohort) => (
            <TableRow key={cohort.id}>
              <TableCell>{cohort.name}</TableCell>
              <TableCell>{new Date(cohort.startDate).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(cohort.endDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <Chip
                  label={cohort.status}
                  color={cohort.status === 'active' ? 'success' : 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <IconButton
                  size="small"
                  onClick={() => navigate(`/cohorts/${cohort.id}`)}
                >
                  <ViewIcon />
                </IconButton>
                <IconButton size="small" onClick={() => console.log('Edit', cohort.id)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={() => console.log('Delete', cohort.id)}>
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

