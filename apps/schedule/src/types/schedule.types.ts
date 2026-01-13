import type { Cohort, Module, Instructor, Program } from '@talendig/shared';

/**
 * Specialization enum for filtering programs
 * Maps to Program.type field
 */
export enum Specialization {
  ALL = 'ALL',
  // Add more specializations as needed based on Program.type values
  // Example: FULL_STACK = 'Full-Stack',
  // FRONTEND = 'Frontend',
  // BACKEND = 'Backend',
}

/**
 * ActiveClass represents a cohort with its current module information
 * for display in the schedule app
 */
export interface ActiveClass {
  id: string;
  cohortId: string;
  title: string; // Cohort name
  month: number; // Current module month (1-10)
  specialization: string; // Program type
  instructor: {
    id?: string;
    name: string;
    avatarUrl?: string;
  };
  schedule: string; // Formatted schedule dates
  timeRange: string; // Calculated time range (e.g., "9:00 AM - 12:00 PM")
  program: {
    id: string;
    name: string;
    type: string;
  };
  module: {
    id: string;
    month: number;
    hours: number;
    startDate?: string;
    endDate?: string;
  };
}

/**
 * Props for SearchFilter component
 */
export interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCohort: string; // Cohort ID or 'ALL'
  onCohortChange: (cohortId: string) => void;
  availableCohorts: Array<{ id: string; name: string }>; // Available cohorts
}

/**
 * Props for ScheduleCohortCard component
 */
export interface ScheduleCohortCardProps {
  activeClass: ActiveClass;
  onClick?: () => void;
}
