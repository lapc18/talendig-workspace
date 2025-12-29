import { FC, useEffect, useState } from 'react';
import { Box, Grid, TextField, Select, MenuItem, FormControl, InputLabel, IconButton, Typography, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import { useServices, LoadingSpinner, PageHeader, FiltersBar, CohortCard, PaginationControls } from '@talendig/shared';
import type { Cohort, Program, Student } from '@talendig/shared';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface CohortWithDetails extends Cohort {
  program?: Program;
  studentsCount: number;
}

const ITEMS_PER_PAGE = 9;

export const CohortsList: FC = () => {
  const { cohortsService, programsService, studentsService } = useServices();
  const navigate = useNavigate();
  const [cohorts, setCohorts] = useState<CohortWithDetails[]>([]);
  const [filteredCohorts, setFilteredCohorts] = useState<CohortWithDetails[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [programFilter, setProgramFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadCohorts();
    loadPrograms();
  }, []);

  useEffect(() => {
    filterCohorts();
  }, [cohorts, searchQuery, statusFilter, programFilter]);

  const loadPrograms = async () => {
    try {
      const data = await programsService.getAll();
      setPrograms(data);
    } catch (error) {
      console.error('Error loading programs:', error);
    }
  };

  const loadCohorts = async () => {
    try {
      setLoading(true);
      const data = await cohortsService.getAll();
      const activeCohorts = data.filter((cohort) => cohort.status === 'active');
      
      const cohortsWithDetails = await Promise.all(
        activeCohorts.map(async (cohort) => {
          const [program, students] = await Promise.all([
            cohort.programId
              ? programsService.getById(cohort.programId).catch(() => null)
              : Promise.resolve(null),
            studentsService.getByCohortId(cohort.id).catch(() => []),
          ]);
          
          return {
            ...cohort,
            program: program || undefined,
            studentsCount: students.length,
          };
        })
      );
      
      setCohorts(cohortsWithDetails);
    } catch (error) {
      console.error('Error loading cohorts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCohorts = () => {
    let filtered = [...cohorts];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (cohort) =>
          cohort.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cohort.program?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((cohort) => cohort.status === statusFilter);
    }

    // Apply program filter
    if (programFilter !== 'all') {
      filtered = filtered.filter((cohort) => cohort.programId === programFilter);
    }

    setFilteredCohorts(filtered);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedCohorts = filteredCohorts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredCohorts.length / ITEMS_PER_PAGE);

  const handleMenuClick = (cohortId: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    // Menu actions can be added here
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      <PageHeader
        title="Cohorts"
        subtitle="Manage and view all student cohorts"
        actions={
          <Button
            variant="contained"
            onClick={() => navigate('/cohorts/new')}
          >
            Create Cohort
          </Button>
        }
      />

      <FiltersBar>
        <TextField
          placeholder="Search cohorts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: <SearchIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ flex: 1, maxWidth: 400 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Program</InputLabel>
          <Select
            value={programFilter}
            label="Program"
            onChange={(e) => setProgramFilter(e.target.value)}
          >
            <MenuItem value="all">All Programs</MenuItem>
            {programs.map((program) => (
              <MenuItem key={program.id} value={program.id}>
                {program.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
          </Select>
        </FormControl>
        <IconButton size="small" sx={{ border: '1px solid', borderColor: 'divider' }}>
          <SortIcon />
        </IconButton>
      </FiltersBar>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {paginatedCohorts.map((cohort) => (
          <Grid item xs={12} sm={6} md={4} key={cohort.id}>
            <CohortCard
              title={cohort.name}
              subtitle={cohort.program?.name}
              status={cohort.status}
              program={cohort.program?.name}
              studentsCount={cohort.studentsCount}
              startDate={format(new Date(cohort.startDate), 'MMM dd, yyyy')}
              endDate={format(new Date(cohort.endDate), 'MMM dd, yyyy')}
              onClick={() => navigate(`/cohorts/${cohort.id}`)}
              onMenuClick={handleMenuClick(cohort.id)}
              onProgramClick={(e) => {
                e.stopPropagation();
                if (cohort.program) {
                  navigate(`/programs/${cohort.program.id}`);
                }
              }}
            />
          </Grid>
        ))}
      </Grid>

      {filteredCohorts.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography
            variant="body1"
            sx={{
              color: (theme) =>
                theme.palette.mode === 'light' ? '#64748b' : '#94a3b8',
            }}
          >
            No cohorts found
          </Typography>
        </Box>
      )}

      {filteredCohorts.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={filteredCohorts.length}
          onPageChange={handlePageChange}
        />
      )}
    </Box>
  );
};

