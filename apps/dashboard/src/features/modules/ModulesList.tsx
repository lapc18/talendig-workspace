import { FC, useEffect, useState } from 'react';
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
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import { useServices, LoadingSpinner, PageHeader, FiltersBar, ModuleCard, PaginationControls } from '@talendig/shared';
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
  }, [modules, searchQuery, statusFilter]);

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

  const filterModules = () => {
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

    setFilteredModules(filtered);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
      <PageHeader
        title="Modules"
        subtitle="Manage and view all program modules"
        actions={
          <Button
            variant="contained"
            onClick={() => navigate('/modules/new')}
          >
            Create Module
          </Button>
        }
      />

      <FiltersBar>
        <TextField
          placeholder="Search modules..."
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
        <IconButton size="small" sx={{ border: '1px solid', borderColor: 'divider' }}>
          <SortIcon />
        </IconButton>
      </FiltersBar>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {paginatedModules.map((module) => (
          <Grid item xs={12} sm={6} md={4} key={module.id}>
            <ModuleCard
              title={`Month ${module.month}`}
              subtitle={module.program?.name}
              status={module.status}
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

