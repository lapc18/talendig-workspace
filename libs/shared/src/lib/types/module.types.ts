import type { BaseEntity } from './common.types';

export interface Module extends BaseEntity {
  programId: string;
  month: number;
  hours: number;
}

export interface CreateModuleInput {
  programId: string;
  month: number;
  hours: number;
}

export interface UpdateModuleInput extends Partial<CreateModuleInput> {
  id: string;
}

