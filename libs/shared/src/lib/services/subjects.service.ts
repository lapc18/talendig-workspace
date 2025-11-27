import { FirestoreService } from './firestore.service';
import type { Subject, CreateSubjectInput, UpdateSubjectInput } from '../types';
import { Firestore } from 'firebase/firestore';

const COLLECTION_NAME = 'subjects';

export class SubjectsService {
  private firestoreService: FirestoreService;

  constructor(db: Firestore) {
    this.firestoreService = new FirestoreService(db);
  }

  async getById(id: string): Promise<Subject | null> {
    return this.firestoreService.getById<Subject>(COLLECTION_NAME, id);
  }

  async getAll(): Promise<Subject[]> {
    return this.firestoreService.getAll<Subject>(COLLECTION_NAME);
  }

  async create(input: CreateSubjectInput): Promise<Subject> {
    return this.firestoreService.create<Subject>(COLLECTION_NAME, {
      ...input,
      status: input.status || 'active',
    });
  }

  async update(input: UpdateSubjectInput): Promise<void> {
    const { id, ...data } = input;
    return this.firestoreService.update<Subject>(COLLECTION_NAME, id, data);
  }

  async delete(id: string): Promise<void> {
    return this.firestoreService.delete(COLLECTION_NAME, id);
  }
}

