import { FC, useEffect, useState, useCallback } from 'react';
import { Box, Grid, TextField, Select, MenuItem, FormControl, InputLabel, IconButton, Typography, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import SchoolIcon from '@mui/icons-material/School';
import { useServices, LoadingSpinner, PageHeader, FiltersBar, ProgramCard, PaginationControls } from '@talendig/shared';
import type { Program } from '@talendig/shared';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface ProgramWithDetails extends Program {
  modulesCount: number;
  studentsCount: number;
  startDate?: string;
  endDate?: string;
}

const ITEMS_PER_PAGE = 9;

export const ProgramsList: FC = () => {
  const { programsService, modulesService, studentsService } = useServices();
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<ProgramWithDetails[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<ProgramWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const loadPrograms = useCallback(async () => {
    try {
      setLoading(true);
      const data = await programsService.getAll();
      
      // Load modules and students for each program
      const programsWithDetails = await Promise.all(
        data.map(async (program) => {
          try {
            const [modules, students] = await Promise.all([
              modulesService.getByProgramId(program.id).catch(() => []),
              studentsService.getAll().catch(() => []),
            ]);
            
            // Count students in cohorts that belong to this program
            const programStudents = students.filter((student) => {
              // This would need proper cohort-program relationship
              // For now, just return all students count
              return true;
            });
            
            const modulesWithDates = modules.filter((m) => m.startDate || m.endDate);
            
            let startDate: string | undefined;
            let endDate: string | undefined;
            
            if (modulesWithDates.length > 0) {
              const dates = modulesWithDates
                .map((m) => m.startDate || m.endDate)
                .filter((d): d is string => !!d)
                .sort();
              if (dates.length > 0) {
                startDate = dates[0];
                endDate = dates[dates.length - 1];
              }
            }
            
            return {
              ...program,
              modulesCount: modules.length,
              studentsCount: programStudents.length,
              startDate,
              endDate,
            };
          } catch (error) {
            console.error(`Error loading details for program ${program.id}:`, error);
            return {
              ...program,
              modulesCount: 0,
              studentsCount: 0,
            };
          }
        })
      );
      
      setPrograms(programsWithDetails);
    } catch (error) {
      console.error('Error loading programs:', error);
    } finally {
      setLoading(false);
    }
  }, [programsService, modulesService, studentsService]);

  const filterPrograms = useCallback(() => {
    let filtered = [...programs];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (program) =>
          program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          program.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((program) => program.status === statusFilter);
    }

    setFilteredPrograms(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [programs, searchQuery, statusFilter]);

  useEffect(() => {
    loadPrograms();
  }, [loadPrograms]);

  useEffect(() => {
    filterPrograms();
  }, [filterPrograms]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedPrograms = filteredPrograms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredPrograms.length / ITEMS_PER_PAGE);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      <PageHeader
        title="Programs"
        subtitle="Manage and view all programs"
        actions={
          <Button
            variant="contained"
            onClick={() => navigate('/programs/new')}
          >
            Create Program
          </Button>
        }
      />

      <FiltersBar>
        <TextField
          placeholder="Search programs..."
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
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
          </Select>
        </FormControl>
        <IconButton size="small" sx={{ border: '1px solid', borderColor: 'divider' }}>
          <SortIcon />
        </IconButton>
      </FiltersBar>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {paginatedPrograms.map((program) => (
          <Grid item xs={12} sm={6} md={4} key={program.id}>
            <ProgramCard
              title={program.name}
              description={program.description || ''}
              status={program.status}
              duration={`${program.durationMonths} months`}
              modulesCount={program.modulesCount}
              studentsCount={program.studentsCount}
              date={
                program.startDate
                  ? format(new Date(program.startDate), 'MMM dd, yyyy')
                  : undefined
              }
              icon={<SchoolIcon />}
              onClick={() => navigate(`/programs/${program.id}`)}
              onMenuClick={(e) => {
                      e.stopPropagation();
                // Handle menu click
              }}
            />
          </Grid>
        ))}
      </Grid>

      {filteredPrograms.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography
            variant="body1"
            sx={{
              color: (theme) =>
                theme.palette.mode === 'light' ? '#64748b' : '#94a3b8',
            }}
          >
            No programs found
          </Typography>
        </Box>
      )}

      {filteredPrograms.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={filteredPrograms.length}
          onPageChange={handlePageChange}
        />
      )}
    </Box>
  );
};

