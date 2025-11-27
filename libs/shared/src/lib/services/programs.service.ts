import { FirestoreService } from './firestore.service';
import type { Program, CreateProgramInput, UpdateProgramInput } from '../types';
import { Firestore } from 'firebase/firestore';
import { firestoreHelpers } from './firestore.service';

const COLLECTION_NAME = 'programs';

export class ProgramsService {
  private firestoreService: FirestoreService;

  constructor(db: Firestore) {
    this.firestoreService = new FirestoreService(db);
  }

  async getById(id: string): Promise<Program | null> {
    return this.firestoreService.getById<Program>(COLLECTION_NAME, id);
  }

  async getAll(): Promise<Program[]> {
    return this.firestoreService.getAll<Program>(COLLECTION_NAME);
  }

  async getByCohortId(cohortId: string): Promise<Program | null> {
    const programs = await this.firestoreService.query<Program>(COLLECTION_NAME, [
      firestoreHelpers.where('cohortId', '==', cohortId),
    ]);
    return programs.length > 0 ? programs[0] : null;
  }

  async create(input: CreateProgramInput): Promise<Program> {
    // Validate that cohortId is unique if provided
    if (input.cohortId) {
      const existingProgram = await this.getByCohortId(input.cohortId);
      if (existingProgram) {
        throw new Error(`Program already exists for cohort ${input.cohortId}`);
      }
    }

    return this.firestoreService.create<Program>(COLLECTION_NAME, {
      ...input,
      status: input.status || 'active',
    });
  }

  async update(input: UpdateProgramInput): Promise<void> {
    const { id, ...data } = input;

    // Get existing program to check if cohortId is already set
    const existingProgram = await this.getById(id);
    if (existingProgram?.cohortId) {
      // If program already has a cohortId, prevent changing it
      if (data.cohortId && data.cohortId !== existingProgram.cohortId) {
        throw new Error('Cannot change cohortId for a program that is already linked to a cohort');
      }
      // Remove cohortId from update if it's the same (no change needed)
      if (data.cohortId === existingProgram.cohortId) {
        delete data.cohortId;
      }
    } else if (data.cohortId) {
      // If program doesn't have cohortId yet, validate uniqueness
      const existingProgramWithCohort = await this.getByCohortId(data.cohortId);
      if (existingProgramWithCohort && existingProgramWithCohort.id !== id) {
        throw new Error(`Program already exists for cohort ${data.cohortId}`);
      }
    }

    return this.firestoreService.update<Program>(COLLECTION_NAME, id, data);
  }

  async delete(id: string): Promise<void> {
    return this.firestoreService.delete(COLLECTION_NAME, id);
  }
}

