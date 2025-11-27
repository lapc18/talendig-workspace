import { FirestoreService } from './firestore.service';
import type { Cohort, CreateCohortInput, UpdateCohortInput, Program } from '../types';
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

  async getProgramByCohortId(cohortId: string): Promise<Program | null> {
    return this.programsService.getByCohortId(cohortId);
  }

  async create(input: CreateCohortInput): Promise<Cohort> {
    // Validate that the selected program is not already linked to another cohort
    const program = await this.programsService.getById(input.programId);
    if (!program) {
      throw new Error(`Program with id ${input.programId} not found`);
    }
    if (program.cohortId) {
      throw new Error(`Program ${input.programId} is already linked to cohort ${program.cohortId}`);
    }

    const cohort = await this.firestoreService.create<Cohort>(COLLECTION_NAME, {
      ...input,
      status: input.status || 'active',
    });

    // Link the program to this cohort
    await this.programsService.update({
      id: input.programId,
      cohortId: cohort.id,
    });

    return cohort;
  }

  async update(input: UpdateCohortInput): Promise<void> {
    const { id, ...data } = input;
    const existingCohort = await this.getById(id);
    if (!existingCohort) {
      throw new Error(`Cohort with id ${id} not found`);
    }

    // If programId is being changed, validate the new program
    if (data.programId && data.programId !== existingCohort.programId) {
      const newProgram = await this.programsService.getById(data.programId);
      if (!newProgram) {
        throw new Error(`Program with id ${data.programId} not found`);
      }
      if (newProgram.cohortId && newProgram.cohortId !== id) {
        throw new Error(`Program ${data.programId} is already linked to another cohort`);
      }

      // Unlink old program
      if (existingCohort.programId) {
        const oldProgram = await this.programsService.getById(existingCohort.programId);
        if (oldProgram && oldProgram.cohortId === id) {
          await this.programsService.update({
            id: existingCohort.programId,
            cohortId: undefined,
          });
        }
      }

      // Link new program
      await this.programsService.update({
        id: data.programId,
        cohortId: id,
      });
    }

    return this.firestoreService.update<Cohort>(COLLECTION_NAME, id, data);
  }

  async delete(id: string): Promise<void> {
    return this.firestoreService.delete(COLLECTION_NAME, id);
  }
}

