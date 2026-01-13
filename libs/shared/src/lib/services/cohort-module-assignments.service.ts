import { FirestoreService } from './firestore.service';
import type {
  CohortModuleAssignment,
  CreateCohortModuleAssignmentInput,
  UpdateCohortModuleAssignmentInput,
} from '../types';
import { Firestore } from 'firebase/firestore';
import { firestoreHelpers } from './firestore.service';

const COLLECTION_NAME = 'cohortModuleAssignments';

export class CohortModuleAssignmentsService {
  private firestoreService: FirestoreService;

  constructor(db: Firestore) {
    this.firestoreService = new FirestoreService(db);
  }

  async getById(id: string): Promise<CohortModuleAssignment | null> {
    return this.firestoreService.getById<CohortModuleAssignment>(COLLECTION_NAME, id);
  }

  async getAll(): Promise<CohortModuleAssignment[]> {
    return this.firestoreService.getAll<CohortModuleAssignment>(COLLECTION_NAME);
  }

  async getByCohortId(cohortId: string): Promise<CohortModuleAssignment[]> {
    return this.firestoreService.query<CohortModuleAssignment>(COLLECTION_NAME, [
      firestoreHelpers.where('cohortId', '==', cohortId),
    ]);
  }

  async getByModuleId(moduleId: string): Promise<CohortModuleAssignment[]> {
    return this.firestoreService.query<CohortModuleAssignment>(COLLECTION_NAME, [
      firestoreHelpers.where('moduleId', '==', moduleId),
    ]);
  }

  async create(input: CreateCohortModuleAssignmentInput): Promise<CohortModuleAssignment> {
    return this.firestoreService.create<CohortModuleAssignment>(COLLECTION_NAME, {
      ...input,
      status: input.status || 'active',
    });
  }

  async createBatch(inputs: CreateCohortModuleAssignmentInput[]): Promise<CohortModuleAssignment[]> {
    const promises = inputs.map((input) => this.create(input));
    return Promise.all(promises);
  }

  async update(input: UpdateCohortModuleAssignmentInput): Promise<void> {
    const { id, ...data } = input;
    return this.firestoreService.update<CohortModuleAssignment>(COLLECTION_NAME, id, data);
  }

  async deactivate(id: string): Promise<void> {
    return this.firestoreService.update<CohortModuleAssignment>(COLLECTION_NAME, id, {
      status: 'inactive',
    });
  }
}

