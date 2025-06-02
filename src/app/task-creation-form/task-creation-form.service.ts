import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  TaskCreationFormData,
  User,
  TaskCreationResponse,
} from './task-creation-form.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskCreationFormService {
  constructor() {}

  // Simulate API call to create task
  createTask(taskData: TaskCreationFormData): Observable<TaskCreationResponse> {
    console.log('Creating task:', taskData);
    // Here you would make HTTP call to your backend
    const response: TaskCreationResponse = {
      success: true,
      taskId: `task_${Date.now()}`,
      message: 'Task created successfully',
    };
    return of(response);
  }

  // Simulate API call to get users
  getUsers(): Observable<User[]> {
    const users: User[] = [
      { id: 'yash-ghori', name: 'Yash Ghori', email: 'yash@example.com' },
      { id: 'john-doe', name: 'John Doe', email: 'john@example.com' },
      { id: 'jane-smith', name: 'Jane Smith', email: 'jane@example.com' },
      { id: 'mike-wilson', name: 'Mike Wilson', email: 'mike@example.com' },
      { id: 'sarah-davis', name: 'Sarah Davis', email: 'sarah@example.com' },
    ];
    return of(users);
  }

  // Simulate API call to delete task
  deleteTask(taskId: string): Observable<TaskCreationResponse> {
    console.log('Deleting task:', taskId);
    const response: TaskCreationResponse = {
      success: true,
      message: 'Task deleted successfully',
    };
    return of(response);
  }

  // Simulate API call to update task
  updateTask(
    taskId: string,
    taskData: TaskCreationFormData
  ): Observable<TaskCreationResponse> {
    console.log('Updating task:', taskId, taskData);
    const response: TaskCreationResponse = {
      success: true,
      taskId: taskId,
      message: 'Task updated successfully',
    };
    return of(response);
  }

  // Validate task dates
  validateTaskDates(startDate: string, endDate: string): boolean {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    // Remove time component for comparison
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    return start >= today && end >= start;
  }
}
