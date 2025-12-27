import { FirestoreService } from './firestore.service';
import type { Module, CreateModuleInput, UpdateModuleInput } from '../types';
import { Firestore } from 'firebase/firestore';
import { firestoreHelpers } from './firestore.service';

const COLLECTION_NAME = 'modules';

export class ModulesService {
  private firestoreService: FirestoreService;

  constructor(db: Firestore) {
    this.firestoreService = new FirestoreService(db);
  }

  async getById(id: string): Promise<Module | null> {
    return this.firestoreService.getById<Module>(COLLECTION_NAME, id);
  }

  async getAll(): Promise<Module[]> {
    return this.firestoreService.getAll<Module>(COLLECTION_NAME);
  }

  async getByProgramId(programId: string): Promise<Module[]> {
    return this.firestoreService.query<Module>(COLLECTION_NAME, [
      firestoreHelpers.where('programId', '==', programId),
      firestoreHelpers.orderBy('month', 'asc'),
    ]);
  }

  async getByInstructorId(instructorId: string): Promise<Module[]> {
    return this.firestoreService.query<Module>(COLLECTION_NAME, [
      firestoreHelpers.where('instructorId', '==', instructorId),
      firestoreHelpers.orderBy('month', 'asc'),
    ]);
  }

  async hasModulesForProgram(programId: string): Promise<boolean> {
    const modules = await this.getByProgramId(programId);
    return modules.length > 0;
  }

  async create(input: CreateModuleInput): Promise<Module> {
    return this.firestoreService.create<Module>(COLLECTION_NAME, {
      ...input,
      status: input.status || 'active',
    });
  }

  async update(input: UpdateModuleInput): Promise<void> {
    const { id, ...data } = input;
    return this.firestoreService.update<Module>(COLLECTION_NAME, id, data);
  }

  async deactivate(id: string): Promise<void> {
    return this.firestoreService.update<Module>(COLLECTION_NAME, id, {
      status: 'inactive',
    });
  }

  async delete(id: string): Promise<void> {
    return this.firestoreService.delete(COLLECTION_NAME, id);
  }
}

