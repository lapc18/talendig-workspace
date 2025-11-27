import type { BaseEntity, Status } from './common.types';

export interface Instructor extends BaseEntity {
  fullName: string;
  email: string;
  phone?: string;
  shortBio?: string;
  status: Status;
  technologies: string[];
  cvStoragePath?: string;
  cvUrl?: string;
}

export interface CreateInstructorInput {
  fullName: string;
  email: string;
  phone?: string;
  shortBio?: string;
  status?: Status;
  technologies?: string[];
  cvStoragePath?: string;
  cvUrl?: string;
}

export interface UpdateInstructorInput extends Partial<CreateInstructorInput> {
  id: string;
}

