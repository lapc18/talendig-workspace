import type { BaseEntity, Status } from './common.types';

export interface Cohort extends BaseEntity {
  name: string;
  programId: string;
  startDate: string;
  endDate: string;
  status: Status;
}

export interface CreateCohortInput {
  name: string;
  programId: string;
  startDate: string;
  endDate: string;
  status?: Status;
}

export interface UpdateCohortInput extends Partial<CreateCohortInput> {
  id: string;
}

