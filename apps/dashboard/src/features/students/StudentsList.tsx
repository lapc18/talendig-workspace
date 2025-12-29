import { FC, useEffect, useState } from 'react';
import { Box, Grid, TextField, Select, MenuItem, FormControl, InputLabel, IconButton, Typography, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useServices, LoadingSpinner, PageHeader, FiltersBar, StudentCard, PaginationControls } from '@talendig/shared';
import type { Student, Cohort } from '@talendig/shared';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface StudentWithCohort extends Student {
  cohort?: Cohort;
}

const ITEMS_PER_PAGE = 9;

export const StudentsList: FC = () => {
  const { studentsService, cohortsService } = useServices();
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentWithCohort[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentWithCohort[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cohortFilter, setCohortFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadStudents();
    loadCohorts();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchQuery, statusFilter, cohortFilter]);

  const loadCohorts = async () => {
    try {
      const data = await cohortsService.getAll();
      setCohorts(data);
    } catch (error) {
      console.error('Error loading cohorts:', error);
    }
  };

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await studentsService.getAll();
      
      const studentsWithCohorts = await Promise.all(
        data.map(async (student) => {
          if (student.cohortId) {
            try {
              const cohort = await cohortsService.getById(student.cohortId);
              return { ...student, cohort: cohort || undefined };
            } catch (error) {
              console.error(`Error loading cohort for student ${student.id}:`, error);
              return student;
            }
          }
          return student;
        })
      );
      
      setStudents(studentsWithCohorts);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = [...students];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (student) =>
          student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((student) => student.status === statusFilter);
    }

    // Apply cohort filter
    if (cohortFilter !== 'all') {
      filtered = filtered.filter((student) => student.cohortId === cohortFilter);
    }

    setFilteredStudents(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);

  const handleMenuClick = (studentId: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    // Menu actions can be added here
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      <PageHeader
        title="Students"
        subtitle="Manage and view all students in the system"
        actions={
          <Button
            variant="contained"
            onClick={() => navigate('/students/new')}
          >
            Create Student
          </Button>
        }
      />

      <FiltersBar>
        <TextField
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: <SearchIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ flex: 1, maxWidth: 400 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Cohort</InputLabel>
          <Select
            value={cohortFilter}
            label="Cohort"
            onChange={(e) => setCohortFilter(e.target.value)}
          >
            <MenuItem value="all">All Cohorts</MenuItem>
            {cohorts.map((cohort) => (
              <MenuItem key={cohort.id} value={cohort.id}>
                {cohort.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <IconButton size="small" sx={{ border: '1px solid', borderColor: 'divider' }}>
          <SortIcon />
        </IconButton>
      </FiltersBar>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {paginatedStudents.map((student) => (
          <Grid item xs={12} sm={6} md={4} key={student.id}>
            <StudentCard
              title={student.fullName}
              subtitle={student.email}
              status={student.status}
              cohort={student.cohort?.name}
              phone={student.phone}
              birthDate={student.birthDate ? format(new Date(student.birthDate), 'MMM dd, yyyy') : undefined}
              onClick={() => navigate(`/students/${student.id}`)}
              onMenuClick={handleMenuClick(student.id)}
              onCohortClick={(e) => {
                e.stopPropagation();
                if (student.cohort) {
                  navigate(`/cohorts/${student.cohort.id}`);
                }
              }}
            />
          </Grid>
        ))}
      </Grid>

      {filteredStudents.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography
            variant="body1"
            sx={{
              color: (theme) =>
                theme.palette.mode === 'light' ? '#64748b' : '#94a3b8',
            }}
          >
            No students found
          </Typography>
        </Box>
      )}

      {filteredStudents.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={filteredStudents.length}
          onPageChange={handlePageChange}
        />
      )}
    </Box>
  );
};

