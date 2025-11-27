import type { BaseEntity, Status } from './common.types';

export interface Student extends BaseEntity {
  cohortId: string;
  fullName: string;
  email: string;
  phone?: string;
  birthDate: string;
  status: Status;
}

export interface CreateStudentInput {
  cohortId: string;
  fullName: string;
  email: string;
  phone?: string;
  birthDate: string;
  status?: Status;
}

export interface UpdateStudentInput extends Partial<CreateStudentInput> {
  id: string;
}

