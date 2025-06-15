// project.interface.ts
export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  createdDate: Date;
  teamMembers: TeamMember[];
  issueCount: number;
  isOffTrack: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role?: string;
}

export enum ProjectStatus {
  ON_TRACK = 'on-track',
  OFF_TRACK = 'off-track',
  COMPLETED = 'completed',
  PENDING = 'pending',
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}
