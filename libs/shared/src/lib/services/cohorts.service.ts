import { FirestoreService } from './firestore.service';
import type { Cohort, CreateCohortInput, UpdateCohortInput } from '../types';
import { Firestore } from 'firebase/firestore';
import { firestoreHelpers } from './firestore.service';
import { ProgramsService } from './programs.service';

const COLLECTION_NAME = 'cohorts';

export class CohortsService {
  private firestoreService: FirestoreService;
  private programsService: ProgramsService;

  constructor(db: Firestore) {
    this.firestoreService = new FirestoreService(db);
    this.programsService = new ProgramsService(db);
  }

  async getById(id: string): Promise<Cohort | null> {
    return this.firestoreService.getById<Cohort>(COLLECTION_NAME, id);
  }

  async getAll(): Promise<Cohort[]> {
    return this.firestoreService.getAll<Cohort>(COLLECTION_NAME);
  }

  async getByProgramId(programId: string): Promise<Cohort[]> {
    return this.firestoreService.query<Cohort>(COLLECTION_NAME, [
      firestoreHelpers.where('programId', '==', programId),
    ]);
  }

  async create(input: CreateCohortInput): Promise<Cohort> {
    // Validate that the program exists
    const program = await this.programsService.getById(input.programId);
    if (!program) {
      throw new Error(`Program with id ${input.programId} not found`);
    }

    return this.firestoreService.create<Cohort>(COLLECTION_NAME, {
      ...input,
      status: input.status || 'active',
    });
  }

  async update(input: UpdateCohortInput): Promise<void> {
    const { id, ...data } = input;
    const existingCohort = await this.getById(id);
    if (!existingCohort) {
      throw new Error(`Cohort with id ${id} not found`);
    }

    // If programId is being changed, validate the new program exists
    if (data.programId && data.programId !== existingCohort.programId) {
      const newProgram = await this.programsService.getById(data.programId);
      if (!newProgram) {
        throw new Error(`Program with id ${data.programId} not found`);
      }
    }

    return this.firestoreService.update<Cohort>(COLLECTION_NAME, id, data);
  }

  async deactivate(id: string): Promise<void> {
    return this.firestoreService.update<Cohort>(COLLECTION_NAME, id, {
      status: 'inactive',
    });
  }
}

