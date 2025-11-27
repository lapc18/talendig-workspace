import { FirestoreService } from './firestore.service';
import type { Student, CreateStudentInput, UpdateStudentInput } from '../types';
import { Firestore } from 'firebase/firestore';
import { firestoreHelpers } from './firestore.service';

const COLLECTION_NAME = 'students';

export class StudentsService {
  private firestoreService: FirestoreService;

  constructor(db: Firestore) {
    this.firestoreService = new FirestoreService(db);
  }

  async getById(id: string): Promise<Student | null> {
    return this.firestoreService.getById<Student>(COLLECTION_NAME, id);
  }

  async getAll(): Promise<Student[]> {
    return this.firestoreService.getAll<Student>(COLLECTION_NAME);
  }

  async getByCohortId(cohortId: string): Promise<Student[]> {
    return this.firestoreService.query<Student>(COLLECTION_NAME, [
      firestoreHelpers.where('cohortId', '==', cohortId),
    ]);
  }

  async create(input: CreateStudentInput): Promise<Student> {
    return this.firestoreService.create<Student>(COLLECTION_NAME, {
      ...input,
      status: input.status || 'active',
    });
  }

  async update(input: UpdateStudentInput): Promise<void> {
    const { id, ...data } = input;
    return this.firestoreService.update<Student>(COLLECTION_NAME, id, data);
  }

  async delete(id: string): Promise<void> {
    return this.firestoreService.delete(COLLECTION_NAME, id);
  }
}

