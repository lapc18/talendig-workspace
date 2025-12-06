import type { BaseEntity, Status } from './common.types';

export interface CohortModuleAssignment extends BaseEntity {
  cohortId: string;
  moduleId: string;
  instructorId: string;
  subjectId: string;
  status: Status;
}

export interface CreateCohortModuleAssignmentInput {
  cohortId: string;
  moduleId: string;
  instructorId: string;
  subjectId: string;
  status?: Status;
}

export interface UpdateCohortModuleAssignmentInput extends Partial<CreateCohortModuleAssignmentInput> {
  id: string;
}

