export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  daysRemaining: number;
  assignees: TaskAssignee[];
  attachments: number;
  comments: number;
  priority: TaskPriority;
  createdDate: Date;
  dueDate: Date;
}

export interface TaskAssignee {
  id: string;
  name: string;
  avatar: string;
  initials: string;
}

export interface TaskColumn {
  id: string;
  title: string;
  status: TaskStatus;
  tasks: Task[];
}

export enum TaskStatus {
  BACKLOG = 'backlog',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface TaskFilter {
  searchTerm: string;
  status?: TaskStatus;
  assignee?: string;
  priority?: TaskPriority;
}

export interface TaskStats {
  total: number;
  backlog: number;
  inProgress: number;
  completed: number;
}
