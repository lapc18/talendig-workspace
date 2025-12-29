import { FC, useEffect, useState, useCallback } from 'react';
import { Box, Grid, TextField, Select, MenuItem, FormControl, InputLabel, IconButton, Typography, Button, Autocomplete, Menu, ListItemIcon, ListItemText, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useServices, LoadingSpinner, PageHeader, FiltersBar, InstructorCard, PaginationControls } from '@talendig/shared';
import type { Instructor, Module, Program, Subject } from '@talendig/shared';
import { useNavigate } from 'react-router-dom';
import { isFuture } from 'date-fns';

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
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    loadInstructors();
  }, []);

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

  const filterInstructors = useCallback(() => {
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
        case 'modules': {
          const now = new Date();
          const aCurrentModules = a.modules.filter((m) => {
            if (!m.startDate || !m.endDate) return false;
            const start = new Date(m.startDate);
            const end = new Date(m.endDate);
            return start <= now && end >= now;
          });
          const bCurrentModules = b.modules.filter((m) => {
            if (!m.startDate || !m.endDate) return false;
            const start = new Date(m.startDate);
            const end = new Date(m.endDate);
            return start <= now && end >= now;
          });
          aValue = aCurrentModules.length;
          bValue = bCurrentModules.length;
          break;
        }
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

    setFilteredInstructors(filtered);
    setCurrentPage(1);
  }, [instructors, searchQuery, statusFilter, technologyFilter, sortField, sortDirection]);

  useEffect(() => {
    filterInstructors();
  }, [filterInstructors]);

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
      modules: 'Current Modules',
    };
    return labels[field] || field;
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
          aria-label="Sort instructors"
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
          {['name', 'email', 'status', 'modules'].map((field) => (
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

