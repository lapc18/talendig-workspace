import { FirestoreService } from './firestore.service';
import type { Program, CreateProgramInput, UpdateProgramInput } from '../types';
import { Firestore } from 'firebase/firestore';

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

  async create(input: CreateProgramInput): Promise<Program> {
    return this.firestoreService.create<Program>(COLLECTION_NAME, {
      ...input,
      status: input.status || 'active',
    });
  }

  async update(input: UpdateProgramInput): Promise<void> {
    const { id, ...data } = input;
    return this.firestoreService.update<Program>(COLLECTION_NAME, id, data);
  }

  async delete(id: string): Promise<void> {
    return this.firestoreService.delete(COLLECTION_NAME, id);
  }
}

