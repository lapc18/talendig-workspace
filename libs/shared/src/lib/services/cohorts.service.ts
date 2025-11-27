import { FirestoreService } from './firestore.service';
import type { Cohort, CreateCohortInput, UpdateCohortInput } from '../types';
import { Firestore } from 'firebase/firestore';
import { firestoreHelpers } from './firestore.service';

const COLLECTION_NAME = 'cohorts';

export class CohortsService {
  private firestoreService: FirestoreService;

  constructor(db: Firestore) {
    this.firestoreService = new FirestoreService(db);
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
    return this.firestoreService.create<Cohort>(COLLECTION_NAME, {
      ...input,
      status: input.status || 'active',
    });
  }

  async update(input: UpdateCohortInput): Promise<void> {
    const { id, ...data } = input;
    return this.firestoreService.update<Cohort>(COLLECTION_NAME, id, data);
  }

  async delete(id: string): Promise<void> {
    return this.firestoreService.delete(COLLECTION_NAME, id);
  }
}

