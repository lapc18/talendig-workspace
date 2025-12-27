import type { BaseEntity, Status } from './common.types';

export interface Module extends BaseEntity {
  programId: string;
  month: number;
  hours: number;
  status: Status;
  instructorId?: string;
  subjectId?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateModuleInput {
  programId: string;
  month: number;
  hours: number;
  status?: Status;
  instructorId?: string;
  subjectId?: string;
  startDate?: string;
  endDate?: string;
}

export interface UpdateModuleInput extends Partial<CreateModuleInput> {
  id: string;
}

