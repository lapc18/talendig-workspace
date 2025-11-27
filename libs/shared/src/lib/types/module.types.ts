import type { BaseEntity } from './common.types';

export interface Module extends BaseEntity {
  programId: string;
  subjectId: string;
  instructorId: string;
  subjectSnapshot: string;
  instructorSnapshot: string;
  startDate: string;
  endDate: string;
  hours: number;
  monthNumber: number;
}

export interface CreateModuleInput {
  programId: string;
  subjectId: string;
  instructorId: string;
  subjectSnapshot: string;
  instructorSnapshot: string;
  startDate: string;
  endDate: string;
  hours: number;
  monthNumber: number;
}

export interface UpdateModuleInput extends Partial<CreateModuleInput> {
  id: string;
}

