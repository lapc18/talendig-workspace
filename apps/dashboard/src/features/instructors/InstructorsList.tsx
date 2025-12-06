import { FC, useEffect, useState } from 'react';
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
  Box,
  Dialog,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useServices } from '@talendig/shared';
import type { Instructor } from '@talendig/shared';
import { LoadingSpinner } from '@talendig/shared';
import { InstructorForm } from './InstructorForm';

export const InstructorsList: FC = () => {
  const { instructorsService } = useServices();
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadInstructors = async () => {
    try {
      setLoading(true);
      const data = await instructorsService.getAll();
      setInstructors(data);
    } catch (error) {
      console.error('Error loading instructors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInstructors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditClick = (instructor: Instructor) => {
    setEditingInstructor(instructor);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingInstructor(null);
  };

  const handleUpdateSuccess = () => {
    handleDialogClose();
    loadInstructors();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Technologies</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {instructors.map((instructor) => (
              <TableRow key={instructor.id}>
                <TableCell>{instructor.fullName}</TableCell>
                <TableCell>{instructor.email}</TableCell>
                <TableCell>{instructor.phone || '-'}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {instructor.technologies.map((tech) => (
                      <Chip key={tech} label={tech} size="small" />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={instructor.status}
                    color={instructor.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleEditClick(instructor)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => console.log('Delete', instructor.id)}>
                    <DeleteIcon />
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
        {editingInstructor && (
            <InstructorForm
              instructor={editingInstructor}
              onSuccess={handleUpdateSuccess}
              onCancel={handleDialogClose}
            />
          )}
      </Dialog>
    </Box>
  );
};

