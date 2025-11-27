import { createContext, useContext, ReactNode } from 'react';
import { Firestore } from 'firebase/firestore';
import {
  ProgramsService,
  ModulesService,
  CohortsService,
  StudentsService,
  SubjectsService,
  InstructorsService,
} from '../services';

interface ServicesContextType {
  programsService: ProgramsService;
  modulesService: ModulesService;
  cohortsService: CohortsService;
  studentsService: StudentsService;
  subjectsService: SubjectsService;
  instructorsService: InstructorsService;
}

const ServicesContext = createContext<ServicesContextType | undefined>(
  undefined
);

export const ServicesProvider: React.FC<{
  children: ReactNode;
  db: Firestore;
}> = ({ children, db }) => {
  const services: ServicesContextType = {
    programsService: new ProgramsService(db),
    modulesService: new ModulesService(db),
    cohortsService: new CohortsService(db),
    studentsService: new StudentsService(db),
    subjectsService: new SubjectsService(db),
    instructorsService: new InstructorsService(db),
  };

  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = (): ServicesContextType => {
  const context = useContext(ServicesContext);
  if (context === undefined) {
    throw new Error('useServices must be used within a ServicesProvider');
  }
  return context;
};

