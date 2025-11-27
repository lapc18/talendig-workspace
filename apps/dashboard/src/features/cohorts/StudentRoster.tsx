import React, { FC } from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import type { Student } from '@talendig/shared';

interface StudentRosterProps {
  cohortId: string;
  students: Student[];
  onUpdate: () => void;
}

export const StudentRoster: FC<StudentRosterProps> = ({ students, onUpdate }) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Student Roster ({students.length} students)
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Birth Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No students enrolled yet
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.fullName}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.phone || '-'}</TableCell>
                  <TableCell>
                    {student.birthDate
                      ? new Date(student.birthDate).toLocaleDateString()
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={student.status}
                      color={student.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

