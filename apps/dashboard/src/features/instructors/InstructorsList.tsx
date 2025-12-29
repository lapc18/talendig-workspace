import { FC, useEffect, useState } from 'react';
import { Box, Grid, TextField, Select, MenuItem, FormControl, InputLabel, IconButton, Typography, Button, Autocomplete } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import { useServices, LoadingSpinner, PageHeader, FiltersBar, InstructorCard, PaginationControls } from '@talendig/shared';
import type { Instructor, Module, Program, Subject } from '@talendig/shared';
import { useNavigate } from 'react-router-dom';
import { format, isFuture } from 'date-fns';

interface InstructorWithDetails extends Instructor {
  modules: Array<Module & { program?: Program; subject?: Subject }>;
  subjects: Subject[];
}

const ITEMS_PER_PAGE = 9;

export const InstructorsList: FC = () => {
  const { instructorsService, modulesService, programsService, subjectsService } = useServices();
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState<InstructorWithDetails[]>([]);
  const [filteredInstructors, setFilteredInstructors] = useState<InstructorWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [technologyFilter, setTechnologyFilter] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadInstructors();
  }, []);

  useEffect(() => {
    filterInstructors();
  }, [instructors, searchQuery, statusFilter, technologyFilter]);

  const loadInstructors = async () => {
    try {
      setLoading(true);
      const instructorsData = await instructorsService.getAll();
      
      const instructorsWithDetails = await Promise.all(
        instructorsData.map(async (instructor) => {
          try {
            const modules = await modulesService.getByInstructorId(instructor.id);
            
            const modulesWithDetails = await Promise.all(
              modules.map(async (module) => {
                const [program, subject] = await Promise.all([
                  module.programId
                    ? programsService.getById(module.programId).catch(() => null)
                    : Promise.resolve(null),
                  module.subjectId
                    ? subjectsService.getById(module.subjectId).catch(() => null)
                    : Promise.resolve(null),
                ]);
                
                return {
                  ...module,
                  program: program || undefined,
                  subject: subject || undefined,
                };
              })
            );
            
            // Get unique subjects from modules
            const subjectIds = new Set(
              modulesWithDetails
                .map((m) => m.subject?.id)
                .filter((id): id is string => !!id)
            );
            const subjects = await Promise.all(
              Array.from(subjectIds).map((id) => subjectsService.getById(id))
            );
            
            return {
              ...instructor,
              modules: modulesWithDetails,
              subjects: subjects.filter((s): s is Subject => !!s),
            };
          } catch (error) {
            console.error(`Error loading details for instructor ${instructor.id}:`, error);
            return {
              ...instructor,
              modules: [],
              subjects: [],
            };
          }
        })
      );
      
      setInstructors(instructorsWithDetails);
    } catch (error) {
      console.error('Error loading instructors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterInstructors = () => {
    let filtered = [...instructors];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (instructor) =>
          instructor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          instructor.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((instructor) => instructor.status === statusFilter);
    }

    // Apply technology filter
    if (technologyFilter.length > 0) {
      filtered = filtered.filter((instructor) =>
        technologyFilter.some((tech) => instructor.technologies.includes(tech))
      );
    }

    setFilteredInstructors(filtered);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedInstructors = filteredInstructors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredInstructors.length / ITEMS_PER_PAGE);

  const getCurrentModules = (modules: InstructorWithDetails['modules']) => {
    const now = new Date();
    return modules.filter((m) => {
      if (!m.startDate || !m.endDate) return false;
      const start = new Date(m.startDate);
      const end = new Date(m.endDate);
      return start <= now && end >= now;
    });
  };

  const getFutureModules = (modules: InstructorWithDetails['modules']) => {
    return modules.filter((m) => {
      if (!m.startDate) return false;
      return isFuture(new Date(m.startDate));
    });
  };

  const getAllTechnologies = () => {
    const techSet = new Set<string>();
    instructors.forEach((instructor) => {
      instructor.technologies.forEach((tech) => techSet.add(tech));
    });
    return Array.from(techSet).sort();
  };

  const handleMenuClick = (instructorId: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    // Menu actions can be added here
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      <PageHeader
        title="Instructors"
        subtitle="Manage and view all instructors"
        actions={
          <Button
            variant="contained"
            onClick={() => navigate('/instructors/new')}
          >
            Create Instructor
          </Button>
        }
      />

      <FiltersBar>
        <TextField
          placeholder="Search instructors..."
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
        <Autocomplete
          multiple
          size="small"
          options={getAllTechnologies()}
          value={technologyFilter}
          onChange={(_, newValue) => setTechnologyFilter(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Technologies"
              sx={{ minWidth: 200 }}
            />
          )}
        />
        <IconButton size="small" sx={{ border: '1px solid', borderColor: 'divider' }}>
          <SortIcon />
        </IconButton>
      </FiltersBar>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {paginatedInstructors.map((instructor) => {
          const currentModules = getCurrentModules(instructor.modules);
          const futureModules = getFutureModules(instructor.modules);
          
          return (
            <Grid item xs={12} sm={6} md={4} key={instructor.id}>
              <InstructorCard
                title={instructor.fullName}
                subtitle={instructor.email}
                status={instructor.status}
                phone={instructor.phone}
                bio={instructor.shortBio}
                technologies={instructor.technologies}
                subjects={instructor.subjects.map((s) => s.name)}
                modulesCount={currentModules.length}
                futureModulesCount={futureModules.length}
                cvUrl={instructor.cvUrl}
                onClick={() => navigate(`/instructors/${instructor.id}`)}
                onMenuClick={handleMenuClick(instructor.id)}
              />
            </Grid>
          );
        })}
      </Grid>

      {filteredInstructors.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography
            variant="body1"
            sx={{
              color: (theme) =>
                theme.palette.mode === 'light' ? '#64748b' : '#94a3b8',
            }}
          >
            No instructors found
          </Typography>
        </Box>
      )}

      {filteredInstructors.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={filteredInstructors.length}
          onPageChange={handlePageChange}
        />
      )}
    </Box>
  );
};

