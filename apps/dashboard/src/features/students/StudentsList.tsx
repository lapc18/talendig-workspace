import { FC, useEffect, useState, useCallback } from 'react';
import { Box, Grid, TextField, Select, MenuItem, FormControl, InputLabel, IconButton, Typography, Button, Menu, ListItemIcon, ListItemText, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useServices, LoadingSpinner, PageHeader, FiltersBar, StudentCard, PaginationControls } from '@talendig/shared';
import type { Student, Cohort, StudentCardStatus } from '@talendig/shared';
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
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    loadStudents();
    loadCohorts();
  }, []);

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

  const filterStudents = useCallback(() => {
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

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number | undefined;
      let bValue: string | number | undefined;

      switch (sortField) {
        case 'name':
          aValue = a.fullName.toLowerCase();
          bValue = b.fullName.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'birthDate':
          aValue = a.birthDate ? new Date(a.birthDate).getTime() : 0;
          bValue = b.birthDate ? new Date(b.birthDate).getTime() : 0;
          break;
        default:
          return 0;
      }

      if (aValue === undefined || aValue === null) return 1;
      if (bValue === undefined || bValue === null) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    setFilteredStudents(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [students, searchQuery, statusFilter, cohortFilter, sortField, sortDirection]);

  useEffect(() => {
    filterStudents();
  }, [filterStudents]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSortMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSortMenuAnchor(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setSortMenuAnchor(null);
  };

  const handleSortChange = (field: string) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field with ascending direction
      setSortField(field);
      setSortDirection('asc');
    }
    handleSortMenuClose();
  };

  const getSortLabel = (field: string) => {
    const labels: Record<string, string> = {
      name: 'Name',
      email: 'Email',
      status: 'Status',
      birthDate: 'Birth Date',
    };
    return labels[field] || field;
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
      <FiltersBar>
        <TextField
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: <SearchIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ flex: 1 }}
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
        <IconButton
          size="small"
          onClick={handleSortMenuOpen}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            position: 'relative',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
          aria-label="Sort students"
        >
          <SortIcon />
          {sortField && (
            <Box
              sx={{
                position: 'absolute',
                top: 2,
                right: 2,
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
              }}
            />
          )}
        </IconButton>
        <Menu
          anchorEl={sortMenuAnchor}
          open={Boolean(sortMenuAnchor)}
          onClose={handleSortMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem disabled>
            <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
              Sort by
            </Typography>
          </MenuItem>
          <Divider />
          {['name', 'email', 'status', 'birthDate'].map((field) => (
            <MenuItem
              key={field}
              onClick={() => handleSortChange(field)}
              selected={sortField === field}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                {sortField === field ? (
                  sortDirection === 'asc' ? (
                    <ArrowUpwardIcon fontSize="small" color="primary" />
                  ) : (
                    <ArrowDownwardIcon fontSize="small" color="primary" />
                  )
                ) : null}
              </ListItemIcon>
              <ListItemText primary={getSortLabel(field)} />
            </MenuItem>
          ))}
        </Menu>
      </FiltersBar>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {paginatedStudents.map((student) => (
          <Grid item xs={12} sm={6} md={4} key={student.id}>
            <StudentCard
              title={student.fullName}
              subtitle={student.email}
              status={student.status as StudentCardStatus}
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

