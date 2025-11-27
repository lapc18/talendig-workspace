import type { BaseEntity, Status } from './common.types';

export interface Program extends BaseEntity {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  durationMonths: number;
  status: Status;
  cohortId?: string;
  programType?: string;
}

export interface CreateProgramInput {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  durationMonths: number;
  status?: Status;
  cohortId?: string;
  programType?: string;
}

export interface UpdateProgramInput extends Partial<CreateProgramInput> {
  id: string;
}

