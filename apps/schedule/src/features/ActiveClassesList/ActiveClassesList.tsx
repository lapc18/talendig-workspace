import { FC, useEffect, useState, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  useTheme,
  styled,
  Button,
} from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { useServices } from '@talendig/shared';
import { LoadingSpinner } from '@talendig/shared';
import type {
  Instructor,
} from '@talendig/shared';
import { SearchFilter } from '../../components/SearchFilter';
import { ScheduleCohortCard } from '../../components/ScheduleCohortCard';
import type { ActiveClass } from '../../types/schedule.types';
import {
  calculateCurrentModule,
  formatSchedule,
  getInstructorDisplayName,
} from '../../utils/classCalculations';

const Container = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.mode === 'light' ? '#f6f6f8' : '#101322',
}));

const MainContent = styled(Box)(({ theme }) => ({
  flex: 1,
  maxWidth: 1280, // max-w-7xl
  width: '100%',
  margin: '0 auto',
  padding: '48px 24px',
}));

const HeroSection = styled(Box)({
  marginBottom: 48,
  maxWidth: 672, // max-w-2xl (42rem)
});

const HeroTitle = styled(Typography)(({ theme }) => ({
  fontSize: 36, // text-4xl
  fontWeight: 900,
  color: theme.palette.mode === 'light' ? '#0f172a' : '#ffffff',
  letterSpacing: '-0.02em',
  marginBottom: 16,
  lineHeight: 1.2,
}));

const HeroDescription = styled(Typography)(({ theme }) => ({
  fontSize: 18, // text-lg
  color: theme.palette.mode === 'light' ? '#475569' : '#cbd5e1',
  lineHeight: 1.75, // leading-relaxed
}));

const CardsGrid = styled(Box)({
  marginBottom: 48,
  display: 'grid',
  gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
  gap: 24, // gap-6
  '@media (min-width: 1200px)': { // lg breakpoint (1200px)
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
});

const EmptyState = styled(Box)(({ theme }) => ({
  gridColumn: '1 / -1',
  padding: '80px 24px',
  textAlign: 'center',
  backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : '#0f172a',
  border: `2px dashed ${theme.palette.mode === 'light' ? '#cbd5e1' : '#334155'}`,
  borderRadius: 16,
  '@media (min-width: 1200px)': {
    gridColumn: '1 / -1', // Span all columns on lg screens too
  },
}));

const EmptyStateIcon = styled(SearchOffIcon)(({ theme }) => ({
  fontSize: 64,
  color: theme.palette.mode === 'light' ? '#cbd5e1' : '#475569',
  marginBottom: 16,
}));

const ClearFiltersButton = styled(Button)(({ theme }) => ({
  marginTop: 24,
  color: '#1337ec',
  fontWeight: 700,
  textTransform: 'none',
  '&:hover': {
    textDecoration: 'underline',
    backgroundColor: 'transparent',
  },
}));

const Footer = styled(Box)({
  marginTop: 64,
  textAlign: 'center',
});

const FooterText = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  color: theme.palette.mode === 'light' ? '#94a3b8' : '#64748b',
}));

export const ActiveClassesList: FC = () => {
  const theme = useTheme();
  const {
    cohortsService,
    modulesService,
    instructorsService,
    programsService,
    cohortModuleAssignmentsService,
  } = useServices();

  const [activeClasses, setActiveClasses] = useState<ActiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCohort, setSelectedCohort] = useState<string>('ALL');

  const loadActiveClasses = useCallback(async () => {
    try {
      setLoading(true);

      // Get all active cohorts
      const allCohorts = await cohortsService.getAll();
      const activeCohorts = allCohorts.filter(
        (cohort) => cohort.status === 'active'
      );

      const classesData: ActiveClass[] = [];

      // Process each active cohort
      for (const cohort of activeCohorts) {
        try {
          // Calculate current module number
          const currentModuleNumber = calculateCurrentModule(cohort.startDate);

          // Get program and modules in parallel
          const [program, programModules] = await Promise.all([
            programsService.getById(cohort.programId).catch(() => null),
            modulesService.getByProgramId(cohort.programId),
          ]);

          if (!program) {
            continue; // Skip if program not found
          }

          // Find the module for the current month
          const currentModule = programModules.find(
            (m) => m.month === currentModuleNumber
          );

          if (!currentModule) {
            continue; // Skip if no module found for this month
          }

          // Get cohort module assignment for this module
          const assignments =
            await cohortModuleAssignmentsService.getByCohortId(cohort.id);
          const assignment = assignments.find(
            (a) => a.moduleId === currentModule.id && a.status === 'active'
          );

          // Get instructor - prefer assignment instructor, fallback to module instructor
          let instructor: Instructor | null = null;
          const instructorId =
            assignment?.instructorId || currentModule.instructorId;

          if (instructorId) {
            instructor = await instructorsService
              .getById(instructorId)
              .catch(() => null);
          }

          // Format schedule (includes days and time)
          const schedule = formatSchedule(currentModule);

          classesData.push({
            id: `${cohort.id}-${currentModule.id}`,
            cohortId: cohort.id,
            title: cohort.name,
            month: currentModuleNumber,
            specialization: program.type,
            instructor: {
              id: instructor?.id,
              name: getInstructorDisplayName(instructor),
              avatarUrl: undefined, // Not in current data model
            },
            schedule,
            timeRange: '', // Not used anymore, schedule includes time
            program: {
              id: program.id,
              name: program.name,
              type: program.type,
            },
            module: {
              id: currentModule.id,
              month: currentModule.month,
              hours: currentModule.hours,
              startDate: currentModule.startDate,
              endDate: currentModule.endDate,
            },
          });
        } catch (error) {
          console.error(`Error processing cohort ${cohort.id}:`, error);
          // Continue with other cohorts even if one fails
        }
      }

      setActiveClasses(classesData);
    } catch (error) {
      console.error('Error loading active classes:', error);
    } finally {
      setLoading(false);
    }
  }, [
    cohortsService,
    modulesService,
    instructorsService,
    programsService,
    cohortModuleAssignmentsService,
  ]);

  useEffect(() => {
    loadActiveClasses();
  }, [loadActiveClasses]);

  // Get available cohorts from active classes
  const availableCohorts = useMemo(() => {
    const cohortMap = new Map<string, string>();
    activeClasses.forEach((activeClass) => {
      if (activeClass.cohortId && activeClass.title) {
        cohortMap.set(activeClass.cohortId, activeClass.title);
      }
    });
    return Array.from(cohortMap.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [activeClasses]);

  // Filter active classes based on search and cohort
  const filteredClasses = useMemo(() => {
    return activeClasses.filter((activeClass) => {
      const matchesSearch =
        activeClass.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activeClass.instructor.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        activeClass.program.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesCohort =
        selectedCohort === 'ALL' || activeClass.cohortId === selectedCohort;

      return matchesSearch && matchesCohort;
    });
  }, [activeClasses, searchQuery, selectedCohort]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCohort('ALL');
  };

  if (loading) {
    return (
      <Container>
        <MainContent>
          <LoadingSpinner />
        </MainContent>
      </Container>
    );
  }

  return (
    <Container>
      <MainContent>
        {/* Hero Section */}
        <HeroSection>
          <HeroTitle>Active Cohorts</HeroTitle>
          <HeroDescription>
            Explore our currently running specialized programs. Join a community
            of professionals and accelerate your career with expert-led
            training.
          </HeroDescription>
        </HeroSection>

        {/* Filter & Search Bar */}
        <SearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCohort={selectedCohort}
          onCohortChange={setSelectedCohort}
          availableCohorts={availableCohorts}
        />

        {/* Cohort Grid */}
        <CardsGrid>
          {filteredClasses.map((activeClass) => (
            <Box key={activeClass.id}>
              <ScheduleCohortCard activeClass={activeClass} />
            </Box>
          ))}

          {filteredClasses.length === 0 && (
            <EmptyState>
              <EmptyStateIcon />
              <Typography
                variant="h6"
                sx={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: theme.palette.mode === 'light' ? '#94a3b8' : '#64748b',
                  marginBottom: 8,
                }}
              >
                No cohorts found
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.mode === 'light' ? '#94a3b8' : '#64748b',
                }}
              >
                Try adjusting your search or specialization filter.
              </Typography>
              <ClearFiltersButton onClick={handleClearFilters}>
                Clear all filters
              </ClearFiltersButton>
            </EmptyState>
          )}
        </CardsGrid>

        {/* Footer Info */}
        <Footer>
          <FooterText>
            © 2024 Talendig Education. All modules are calculated based on a
            4-week cycle logic from the start date.
          </FooterText>
        </Footer>
      </MainContent>
    </Container>
  );
};
