import { FC, useEffect, useState } from 'react';
import { Box, Grid, TextField, Select, MenuItem, FormControl, InputLabel, IconButton, Typography, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import { useServices, LoadingSpinner, PageHeader, FiltersBar, SubjectCard, PaginationControls } from '@talendig/shared';
import type { Subject, Module, Program } from '@talendig/shared';
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

  useEffect(() => {
    loadSubjects();
  }, []);

  useEffect(() => {
    filterSubjects();
  }, [subjects, searchQuery, typeFilter, statusFilter]);

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

  const filterSubjects = () => {
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

    setFilteredSubjects(filtered);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
      <PageHeader
        title="Subjects"
        subtitle="Manage and view all subjects"
        actions={
          <Button
            variant="contained"
            onClick={() => navigate('/subjects/new')}
          >
            Create Subject
          </Button>
        }
      />

      <FiltersBar>
        <TextField
          placeholder="Search subjects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: <SearchIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ flex: 1, maxWidth: 400 }}
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
        <IconButton size="small" sx={{ border: '1px solid', borderColor: 'divider' }}>
          <SortIcon />
        </IconButton>
      </FiltersBar>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {paginatedSubjects.map((subject) => (
          <Grid item xs={12} sm={6} md={4} key={subject.id}>
            <SubjectCard
              title={subject.name}
              subtitle={subject.code}
              status={subject.status}
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

