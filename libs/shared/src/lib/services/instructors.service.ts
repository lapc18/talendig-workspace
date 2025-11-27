import { FirestoreService } from './firestore.service';
import type {
  Instructor,
  CreateInstructorInput,
  UpdateInstructorInput,
} from '../types';
import { Firestore } from 'firebase/firestore';

const COLLECTION_NAME = 'instructors';

export class InstructorsService {
  private firestoreService: FirestoreService;

  constructor(db: Firestore) {
    this.firestoreService = new FirestoreService(db);
  }

  async getById(id: string): Promise<Instructor | null> {
    return this.firestoreService.getById<Instructor>(COLLECTION_NAME, id);
  }

  async getAll(): Promise<Instructor[]> {
    return this.firestoreService.getAll<Instructor>(COLLECTION_NAME);
  }

  async create(input: CreateInstructorInput): Promise<Instructor> {
    return this.firestoreService.create<Instructor>(COLLECTION_NAME, {
      ...input,
      status: input.status || 'active',
      technologies: input.technologies || [],
    });
  }

  async update(input: UpdateInstructorInput): Promise<void> {
    const { id, ...data } = input;
    return this.firestoreService.update<Instructor>(COLLECTION_NAME, id, data);
  }

  async delete(id: string): Promise<void> {
    return this.firestoreService.delete(COLLECTION_NAME, id);
  }
}

