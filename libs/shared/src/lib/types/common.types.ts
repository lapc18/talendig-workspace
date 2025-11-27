export type Status = 'active' | 'inactive' | 'completed' | 'cancelled';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BaseEntity {
  id: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

