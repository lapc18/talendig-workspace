import { FC, useEffect, useState, useCallback } from 'react';
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useServices, LoadingSpinner, FiltersBar, ModuleCard, PaginationControls, type ModuleCardStatus } from '@talendig/shared';
import type { Module, Program, Instructor, Subject } from '@talendig/shared';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface ModuleWithDetails extends Module {
  program?: Program;
  instructor?: Instructor;
  subject?: Subject;
}

const ITEMS_PER_PAGE = 9;

export const ModulesList: FC = () => {
  const { modulesService, programsService, instructorsService, subjectsService } = useServices();
  const navigate = useNavigate();
  const [modules, setModules] = useState<ModuleWithDetails[]>([]);
  const [filteredModules, setFilteredModules] = useState<ModuleWithDetails[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<string>('month');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(null);

  const filterModules = useCallback(() => {
    let filtered = [...modules];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (module) =>
          `Month ${module.month}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
          module.program?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          module.instructor?.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          module.subject?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((module) => module.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number | undefined;
      let bValue: string | number | undefined;

      switch (sortField) {
        case 'month':
          aValue = a.month;
          bValue = b.month;
          break;
        case 'program':
          aValue = a.program?.name.toLowerCase() || '';
          bValue = b.program?.name.toLowerCase() || '';
          break;
        case 'instructor':
          aValue = a.instructor?.fullName.toLowerCase() || '';
          bValue = b.instructor?.fullName.toLowerCase() || '';
          break;
        case 'subject':
          aValue = a.subject?.name.toLowerCase() || '';
          bValue = b.subject?.name.toLowerCase() || '';
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'startDate':
          aValue = a.startDate ? new Date(a.startDate).getTime() : 0;
          bValue = b.startDate ? new Date(b.startDate).getTime() : 0;
          break;
        case 'hours':
          aValue = a.hours || 0;
          bValue = b.hours || 0;
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

    setFilteredModules(filtered);
    setCurrentPage(1);
  }, [modules, searchQuery, statusFilter, sortField, sortDirection]);

  useEffect(() => {
    loadPrograms();
  }, []);

  useEffect(() => {
    if (selectedProgramId) {
      loadModules();
    } else {
      loadAllModules();
    }
  }, [selectedProgramId]);

  useEffect(() => {
    filterModules();
  }, [filterModules]);

  const loadPrograms = async () => {
    try {
      const data = await programsService.getAll();
      setPrograms(data);
    } catch (error) {
      console.error('Error loading programs:', error);
    }
  };

  const loadModuleDetails = async (moduleList: Module[]): Promise<ModuleWithDetails[]> => {
    return Promise.all(
      moduleList.map(async (module) => {
        const moduleWithDetails: ModuleWithDetails = { ...module };
        
        if (module.programId) {
          try {
            const program = await programsService.getById(module.programId);
            if (program) moduleWithDetails.program = program;
          } catch (error) {
            console.error(`Error loading program for module ${module.id}:`, error);
          }
        }
        
        if (module.instructorId) {
          try {
            const instructor = await instructorsService.getById(module.instructorId);
            if (instructor) moduleWithDetails.instructor = instructor;
          } catch (error) {
            console.error(`Error loading instructor for module ${module.id}:`, error);
          }
        }
        
        if (module.subjectId) {
          try {
            const subject = await subjectsService.getById(module.subjectId);
            if (subject) moduleWithDetails.subject = subject;
          } catch (error) {
            console.error(`Error loading subject for module ${module.id}:`, error);
          }
        }
        
        return moduleWithDetails;
      })
    );
  };

  const loadModules = async () => {
    try {
      setLoading(true);
      const data = await modulesService.getByProgramId(selectedProgramId);
      const activeModules = data.filter((module) => module.status === 'active');
      const modulesWithDetails = await loadModuleDetails(activeModules);
      setModules(modulesWithDetails);
    } catch (error) {
      console.error('Error loading modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllModules = async () => {
    try {
      setLoading(true);
      const data = await modulesService.getAll();
      const activeModules = data.filter((module) => module.status === 'active');
      const modulesWithDetails = await loadModuleDetails(activeModules);
      setModules(modulesWithDetails);
    } catch (error) {
      console.error('Error loading modules:', error);
    } finally {
      setLoading(false);
    }
  };

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
      month: 'Month',
      program: 'Program',
      instructor: 'Instructor',
      subject: 'Subject',
      status: 'Status',
      startDate: 'Start Date',
      hours: 'Hours',
    };
    return labels[field] || field;
  };

  const paginatedModules = filteredModules.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredModules.length / ITEMS_PER_PAGE);

  const handleMenuClick = (moduleId: string) => (e: React.MouseEvent) => {
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
          placeholder="Search modules..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: <SearchIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ flex: 1 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Program</InputLabel>
          <Select
            value={selectedProgramId}
            label="Program"
            onChange={(e) => setSelectedProgramId(e.target.value)}
          >
            <MenuItem value="">All Programs</MenuItem>
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
          aria-label="Sort modules"
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
          {['month', 'program', 'instructor', 'subject', 'status', 'startDate', 'hours'].map((field) => (
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
        {paginatedModules.map((module) => (
          <Grid item xs={12} sm={6} md={4} key={module.id}>
            <ModuleCard
              title={`Month ${module.month}`}
              subtitle={module.program?.name}
              status={module.status as ModuleCardStatus}
              program={module.program?.name}
              instructor={module.instructor?.fullName}
              subject={module.subject ? `${module.subject.name} (${module.subject.code})` : undefined}
              hours={module.hours}
              startDate={module.startDate ? format(new Date(module.startDate), 'MMM dd, yyyy') : undefined}
              endDate={module.endDate ? format(new Date(module.endDate), 'MMM dd, yyyy') : undefined}
              onClick={() => navigate(`/modules/${module.id}`)}
              onMenuClick={handleMenuClick(module.id)}
              onProgramClick={(e) => {
                e.stopPropagation();
                if (module.program) {
                  navigate(`/programs/${module.program.id}`);
                }
              }}
            />
          </Grid>
        ))}
      </Grid>

      {filteredModules.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography
            variant="body1"
            sx={{
              color: (theme) =>
                theme.palette.mode === 'light' ? '#64748b' : '#94a3b8',
            }}
          >
            No modules found
          </Typography>
        </Box>
      )}

      {filteredModules.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={filteredModules.length}
          onPageChange={handlePageChange}
        />
      )}
    </Box>
  );
};

