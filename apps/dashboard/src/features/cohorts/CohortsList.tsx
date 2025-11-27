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
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { useServices } from '@talendig/shared';
import type { Cohort, Program } from '@talendig/shared';
import { LoadingSpinner } from '@talendig/shared';
import { useNavigate } from 'react-router-dom';

interface CohortWithProgram extends Cohort {
  program?: Program;
}

export const CohortsList: FC = () => {
  const { cohortsService, programsService } = useServices();
  const navigate = useNavigate();
  const [cohorts, setCohorts] = useState<CohortWithProgram[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCohorts();
  }, []);

  const loadCohorts = async () => {
    try {
      setLoading(true);
      const data = await cohortsService.getAll();
      // Load program information for each cohort
      const cohortsWithPrograms = await Promise.all(
        data.map(async (cohort) => {
          if (cohort.programId) {
            try {
              const program = await programsService.getById(cohort.programId);
              return { ...cohort, program: program || undefined };
            } catch (error) {
              console.error(`Error loading program for cohort ${cohort.id}:`, error);
              return cohort;
            }
          }
          return cohort;
        })
      );
      setCohorts(cohortsWithPrograms);
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
            <TableCell>Program</TableCell>
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
              <TableCell>
                {cohort.program ? (
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => navigate(`/programs/${cohort.program!.id}`)}
                    sx={{ cursor: 'pointer' }}
                  >
                    {cohort.program.name}
                    {cohort.program.programType ? ` (${cohort.program.programType})` : ''}
                  </Link>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No program
                  </Typography>
                )}
              </TableCell>
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

