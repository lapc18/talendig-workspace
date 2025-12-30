import { FC, useEffect, useState, useCallback } from 'react';
import {
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Typography,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import {
  useServices,
  LoadingSpinner,
  FiltersBar,
  CohortCard,
  PaginationControls,
} from '@talendig/shared';
import type { Cohort, CohortCardStatus, Program } from '@talendig/shared';
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
  const [filteredCohorts, setFilteredCohorts] = useState<CohortWithDetails[]>(
    []
  );
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [programFilter, setProgramFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  const loadPrograms = useCallback(async () => {
    try {
      const data = await programsService.getAll();
      setPrograms(data.filter(p => p.status === 'active'));
    } catch (error) {
      console.error('Error loading programs:', error);
    }
  }, [programsService]);

  const loadCohorts = useCallback(async () => {
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
  }, [cohortsService, studentsService, programsService, setLoading, setCohorts]);

  const filterCohorts = useCallback(() => {
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
      filtered = filtered.filter(
        (cohort) => cohort.programId === programFilter
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number | undefined;
      let bValue: string | number | undefined;

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'program':
          aValue = a.program?.name.toLowerCase() || '';
          bValue = b.program?.name.toLowerCase() || '';
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'students':
          aValue = a.studentsCount;
          bValue = b.studentsCount;
          break;
        case 'startDate':
          aValue = new Date(a.startDate).getTime();
          bValue = new Date(b.startDate).getTime();
          break;
        case 'endDate':
          aValue = new Date(a.endDate).getTime();
          bValue = new Date(b.endDate).getTime();
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

    setFilteredCohorts(filtered);
    setCurrentPage(1);
  }, [
    cohorts,
    searchQuery,
    statusFilter,
    programFilter,
    sortField,
    sortDirection,
  ]);

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
      program: 'Program',
      status: 'Status',
      students: 'Students',
      startDate: 'Start Date',
      endDate: 'End Date',
    };
    return labels[field] || field;
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

  useEffect(() => {
    loadCohorts();
    loadPrograms();
  }, [loadCohorts, loadPrograms]);

  useEffect(() => {
    filterCohorts();
  }, [filterCohorts]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      <FiltersBar>
        <TextField
          placeholder="Search cohorts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <SearchIcon
                sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }}
              />
            ),
          }}
          sx={{ flex: 1 }}
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
          aria-label="Sort cohorts"
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
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, textTransform: 'uppercase' }}
            >
              Sort by
            </Typography>
          </MenuItem>
          <Divider />
          {[
            'name',
            'program',
            'status',
            'students',
            'startDate',
            'endDate',
          ].map((field) => (
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
        {paginatedCohorts.map((cohort) => (
          <Grid item xs={12} sm={6} md={4} key={cohort.id}>
            <CohortCard
              title={cohort.name}
              subtitle={cohort.program?.name}
              status={cohort.status as CohortCardStatus}
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
