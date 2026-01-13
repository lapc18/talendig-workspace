import { FirestoreService } from './firestore.service';
import type { Cohort, CreateCohortInput, UpdateCohortInput } from '../types';
import { Firestore } from 'firebase/firestore';
import { firestoreHelpers } from './firestore.service';
import { ProgramsService } from './programs.service';
import { ModulesService } from './modules.service';
import { CohortModuleAssignmentsService } from './cohort-module-assignments.service';

const COLLECTION_NAME = 'cohorts';

export class CohortsService {
  private firestoreService: FirestoreService;
  private programsService: ProgramsService;
  private modulesService: ModulesService;
  private cohortModuleAssignmentsService: CohortModuleAssignmentsService;

  constructor(db: Firestore) {
    this.firestoreService = new FirestoreService(db);
    this.programsService = new ProgramsService(db);
    this.modulesService = new ModulesService(db);
    this.cohortModuleAssignmentsService = new CohortModuleAssignmentsService(db);
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

  async inheritProgramTimeline(cohortId: string, programId: string): Promise<void> {
    // Validate cohort exists
    const cohort = await this.getById(cohortId);
    if (!cohort) {
      throw new Error(`Cohort with id ${cohortId} not found`);
    }

    // Validate program exists
    const program = await this.programsService.getById(programId);
    if (!program) {
      throw new Error(`Program with id ${programId} not found`);
    }

    // Get all modules for the program
    const modules = await this.modulesService.getByProgramId(programId);
    
    if (modules.length === 0) {
      // No modules to inherit, but don't throw an error - just return
      return;
    }

    // Get existing assignments for this cohort to avoid duplicates
    const existingAssignments = await this.cohortModuleAssignmentsService.getByCohortId(cohortId);
    const existingModuleIds = new Set(existingAssignments.map(a => a.moduleId));

    // Create assignments for modules that don't already have assignments
    const assignmentsToCreate = modules
      .filter(module => !existingModuleIds.has(module.id))
      .map(module => ({
        cohortId,
        moduleId: module.id,
        instructorId: module.instructorId,
        subjectId: module.subjectId,
        status: 'active' as const,
      }));

    if (assignmentsToCreate.length > 0) {
      await this.cohortModuleAssignmentsService.createBatch(assignmentsToCreate);
    }
  }
}

