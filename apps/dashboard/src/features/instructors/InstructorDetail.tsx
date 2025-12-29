import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, Chip, Link } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon } from '@mui/icons-material';
import { useServices, LoadingSpinner, PageHeader } from '@talendig/shared';
import type { Instructor, Module, Program, Subject } from '@talendig/shared';
import { format, isFuture } from 'date-fns';

interface ModuleWithDetails extends Module {
  program?: Program;
  subject?: Subject;
}

export const InstructorDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { instructorsService, modulesService, programsService, subjectsService } = useServices();
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [modules, setModules] = useState<ModuleWithDetails[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadInstructor();
      loadModules();
    }
  }, [id]);

  const loadInstructor = async () => {
    if (!id) return;
    try {
      const data = await instructorsService.getById(id);
      setInstructor(data);
    } catch (error) {
      console.error('Error loading instructor:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadModules = async () => {
    if (!id) return;
    try {
      const modulesData = await modulesService.getByInstructorId(id);
      
      const modulesWithDetails = await Promise.all(
        modulesData.map(async (module) => {
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
      
      setModules(modulesWithDetails);
      
      // Get unique subjects
      const subjectIds = new Set(
        modulesWithDetails
          .map((m) => m.subject?.id)
          .filter((id): id is string => !!id)
      );
      const subjectsData = await Promise.all(
        Array.from(subjectIds).map((subjectId) => subjectsService.getById(subjectId))
      );
      setSubjects(subjectsData.filter((s): s is Subject => !!s));
    } catch (error) {
      console.error('Error loading modules:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!instructor) {
    return <div>Instructor not found</div>;
  }

  const currentModules = modules.filter((m) => {
    if (!m.startDate || !m.endDate) return false;
    const now = new Date();
    const start = new Date(m.startDate);
    const end = new Date(m.endDate);
    return start <= now && end >= now;
  });

  const futureModules = modules.filter((m) => {
    if (!m.startDate) return false;
    return isFuture(new Date(m.startDate));
  });

  return (
    <Box>
      <PageHeader
        title={instructor.fullName}
        subtitle={instructor.email}
        actions={
          <>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/instructors/${id}/edit`)}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/instructors')}
            >
              Back
            </Button>
          </>
        }
      />
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Instructor Details
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
          {instructor.phone && (
            <Box>
              <Typography variant="body2" color="text.secondary">
                Phone
              </Typography>
              <Typography>{instructor.phone}</Typography>
            </Box>
          )}
          <Box>
            <Typography variant="body2" color="text.secondary">
              Status
            </Typography>
            <Chip
              label={instructor.status}
              color={instructor.status === 'active' ? 'success' : 'default'}
              size="small"
            />
          </Box>
        </Box>
        {instructor.shortBio && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Bio
            </Typography>
            <Typography>{instructor.shortBio}</Typography>
          </Box>
        )}
        {instructor.technologies.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Technologies
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {instructor.technologies.map((tech) => (
                <Chip key={tech} label={tech} />
              ))}
            </Box>
          </Box>
        )}
        {instructor.cvUrl && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              CV
            </Typography>
            <Link href={instructor.cvUrl} target="_blank" rel="noopener noreferrer">
              View CV
            </Link>
          </Box>
        )}
      </Paper>
      
      {subjects.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Subjects ({subjects.length})
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
            {subjects.map((subject) => (
              <Chip
                key={subject.id}
                label={subject.name}
                onClick={() => navigate(`/subjects/${subject.id}`)}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        </Paper>
      )}
      
      {currentModules.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Current Modules ({currentModules.length})
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            {currentModules.map((module) => (
              <Box
                key={module.id}
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                }}
              >
                <Typography variant="subtitle1">
                  Month {module.month} - {module.program?.name}
                </Typography>
                {module.subject && (
                  <Typography variant="body2" color="text.secondary">
                    Subject: {module.subject.name}
                  </Typography>
                )}
                {module.startDate && module.endDate && (
                  <Typography variant="body2" color="text.secondary">
                    {format(new Date(module.startDate), 'MMM dd, yyyy')} -{' '}
                    {format(new Date(module.endDate), 'MMM dd, yyyy')}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </Paper>
      )}
      
      {futureModules.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Future Modules ({futureModules.length})
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            {futureModules.map((module) => (
              <Box
                key={module.id}
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                }}
              >
                <Typography variant="subtitle1">
                  Month {module.month} - {module.program?.name}
                </Typography>
                {module.subject && (
                  <Typography variant="body2" color="text.secondary">
                    Subject: {module.subject.name}
                  </Typography>
                )}
                {module.startDate && module.endDate && (
                  <Typography variant="body2" color="text.secondary">
                    {format(new Date(module.startDate), 'MMM dd, yyyy')} -{' '}
                    {format(new Date(module.endDate), 'MMM dd, yyyy')}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

