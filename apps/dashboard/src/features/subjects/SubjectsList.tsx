import { FC, useEffect, useState, useCallback } from 'react';
import { Box, Grid, TextField, Select, MenuItem, FormControl, InputLabel, IconButton, Typography, Button, Menu, ListItemIcon, ListItemText, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useServices, LoadingSpinner, FiltersBar, SubjectCard, PaginationControls } from '@talendig/shared';
import type { Subject, Program, SubjectCardStatus } from '@talendig/shared';
import { useNavigate } from 'react-router-dom';

interface SubjectWithPrograms extends Subject {
  programs: Program[];
}

const ITEMS_PER_PAGE = 9;

export const SubjectsList: FC = () => {
  const { subjectsService, modulesService, programsService } = useServices();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<SubjectWithPrograms[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<SubjectWithPrograms[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(null);

  const filterSubjects = useCallback(() => {
    let filtered = [...subjects];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (subject) =>
          subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          subject.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((subject) => subject.type === typeFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((subject) => subject.status === statusFilter);
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
        case 'code':
          aValue = a.code.toLowerCase();
          bValue = b.code.toLowerCase();
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'hours':
          aValue = a.defaultHours || 0;
          bValue = b.defaultHours || 0;
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

    setFilteredSubjects(filtered);
    setCurrentPage(1);
  }, [subjects, searchQuery, typeFilter, statusFilter, sortField, sortDirection]);

  useEffect(() => {
    loadSubjects();
  }, []);

  useEffect(() => {
    filterSubjects();
  }, [filterSubjects]);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const subjectsData = await subjectsService.getAll();
      const allModules = await modulesService.getAll();
      
      const subjectsWithPrograms = await Promise.all(
        subjectsData.map(async (subject) => {
          const modulesWithSubject = allModules.filter((m) => m.subjectId === subject.id);
          const programIds = new Set(modulesWithSubject.map((m) => m.programId));
          
          const programs = await Promise.all(
            Array.from(programIds).map((id) => programsService.getById(id).catch(() => null))
          );
          
          return {
            ...subject,
            programs: programs.filter((p): p is Program => !!p),
          };
        })
      );
      
      setSubjects(subjectsWithPrograms);
    } catch (error) {
      console.error('Error loading subjects:', error);
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
      name: 'Name',
      code: 'Code',
      type: 'Type',
      status: 'Status',
      hours: 'Default Hours',
    };
    return labels[field] || field;
  };

  const paginatedSubjects = filteredSubjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredSubjects.length / ITEMS_PER_PAGE);

  const handleMenuClick = (subjectId: string) => (e: React.MouseEvent) => {
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
          placeholder="Search subjects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: <SearchIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ flex: 1 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={typeFilter}
            label="Type"
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="Tech">Tech</MenuItem>
            <MenuItem value="Soft Skills">Soft Skills</MenuItem>
            <MenuItem value="Project">Project</MenuItem>
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
          aria-label="Sort subjects"
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
          {['name', 'code', 'type', 'status', 'hours'].map((field) => (
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
        {paginatedSubjects.map((subject) => (
          <Grid item xs={12} sm={6} md={4} key={subject.id}>
            <SubjectCard
              title={subject.name}
              subtitle={subject.code}
              status={subject.status as SubjectCardStatus}
              type={subject.type}
              defaultHours={subject.defaultHours}
              description={subject.description}
              programs={subject.programs.map((p) => p.name)}
              onClick={() => navigate(`/subjects/${subject.id}`)}
              onMenuClick={handleMenuClick(subject.id)}
              onProgramClick={(e, index) => {
                e.stopPropagation();
                if (subject.programs[index]) {
                  navigate(`/programs/${subject.programs[index].id}`);
                }
              }}
            />
          </Grid>
        ))}
      </Grid>

      {filteredSubjects.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography
            variant="body1"
            sx={{
              color: (theme) =>
                theme.palette.mode === 'light' ? '#64748b' : '#94a3b8',
            }}
          >
            No subjects found
          </Typography>
        </Box>
      )}

      {filteredSubjects.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={filteredSubjects.length}
          onPageChange={handlePageChange}
        />
      )}
    </Box>
  );
};

