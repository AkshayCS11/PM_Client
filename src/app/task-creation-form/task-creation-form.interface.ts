export interface TaskCreationFormData {
  taskTitle: string;
  taskType: string;
  taskStartDate: string;
  taskEndDate: string;
  taskDescription: string;
  assignTo: string;
  priority: string;
  taskAssigning: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
}

export type Priority = 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface TaskCreationRequest {
  task: TaskCreationFormData;
  createdBy: string;
  createdAt: Date;
}

export interface TaskCreationResponse {
  success: boolean;
  taskId?: string;
  message: string;
}
