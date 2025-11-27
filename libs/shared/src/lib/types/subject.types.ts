import type { BaseEntity, Status } from './common.types';

export interface Subject extends BaseEntity {
  name: string;
  description: string;
  type: string;
  code: string;
  defaultHours: number;
  status: Status;
}

export interface CreateSubjectInput {
  name: string;
  description: string;
  type: string;
  code: string;
  defaultHours: number;
  status?: Status;
}

export interface UpdateSubjectInput extends Partial<CreateSubjectInput> {
  id: string;
}

