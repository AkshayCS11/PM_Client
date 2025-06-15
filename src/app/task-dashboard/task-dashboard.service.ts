import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Task,
  TaskColumn,
  TaskStatus,
  TaskPriority,
  TaskFilter,
  TaskStats,
  TaskAssignee,
} from './task-dashboard.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>(this.getMockTasks());
  private filterSubject = new BehaviorSubject<TaskFilter>({ searchTerm: '' });

  tasks$ = this.tasksSubject.asObservable();
  filter$ = this.filterSubject.asObservable();

  constructor() {}

  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  getFilteredTasks(): Observable<Task[]> {
    return combineLatest([this.tasks$, this.filter$]).pipe(
      map(([tasks, filter]) => this.applyFilter(tasks, filter))
    );
  }

  getTasksByStatus(): Observable<TaskColumn[]> {
    return this.getFilteredTasks().pipe(
      map((tasks) => [
        {
          id: 'backlog',
          title: 'Backlog',
          status: TaskStatus.BACKLOG,
          tasks: tasks.filter((task) => task.status === TaskStatus.BACKLOG),
        },
        {
          id: 'in-progress',
          title: 'In progress',
          status: TaskStatus.IN_PROGRESS,
          tasks: tasks.filter((task) => task.status === TaskStatus.IN_PROGRESS),
        },
        {
          id: 'completed',
          title: 'Completed',
          status: TaskStatus.COMPLETED,
          tasks: tasks.filter((task) => task.status === TaskStatus.COMPLETED),
        },
      ])
    );
  }

  getTaskStats(): Observable<TaskStats> {
    return this.tasks$.pipe(
      map((tasks) => ({
        total: tasks.length,
        backlog: tasks.filter((task) => task.status === TaskStatus.BACKLOG)
          .length,
        inProgress: tasks.filter(
          (task) => task.status === TaskStatus.IN_PROGRESS
        ).length,
        completed: tasks.filter((task) => task.status === TaskStatus.COMPLETED)
          .length,
      }))
    );
  }

  updateFilter(filter: Partial<TaskFilter>): void {
    const currentFilter = this.filterSubject.value;
    this.filterSubject.next({ ...currentFilter, ...filter });
  }

  addTask(task: Omit<Task, 'id'>): void {
    const newTask: Task = {
      ...task,
      id: this.generateId(),
    };
    const currentTasks = this.tasksSubject.value;
    this.tasksSubject.next([...currentTasks, newTask]);
  }

  updateTask(taskId: string, updates: Partial<Task>): void {
    const currentTasks = this.tasksSubject.value;
    const updatedTasks = currentTasks.map((task) =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    this.tasksSubject.next(updatedTasks);
  }

  deleteTask(taskId: string): void {
    const currentTasks = this.tasksSubject.value;
    const filteredTasks = currentTasks.filter((task) => task.id !== taskId);
    this.tasksSubject.next(filteredTasks);
  }

  moveTask(taskId: string, newStatus: TaskStatus): void {
    this.updateTask(taskId, { status: newStatus });
  }

  private applyFilter(tasks: Task[], filter: TaskFilter): Task[] {
    return tasks.filter((task) => {
      const matchesSearch =
        !filter.searchTerm ||
        task.title.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
        task.description
          .toLowerCase()
          .includes(filter.searchTerm.toLowerCase());

      const matchesStatus = !filter.status || task.status === filter.status;
      const matchesPriority =
        !filter.priority || task.priority === filter.priority;
      const matchesAssignee =
        !filter.assignee 
        // task.assignees.some((assignee) => assignee.id === filter.assignee);

      return (
        matchesSearch && matchesStatus && matchesPriority && matchesAssignee
      );
    });
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private getMockTasks(): Task[] {
    const mockAssignees: TaskAssignee[] = [
      { id: '1', name: 'John Doe', avatar: '', initials: 'JD' },
      { id: '2', name: 'Jane Smith', avatar: '', initials: 'JS' },
      { id: '3', name: 'Mike Johnson', avatar: '', initials: 'MJ' },
      { id: '4', name: 'Sarah Wilson', avatar: '', initials: 'SW' },
      { id: '5', name: 'David Brown', avatar: '', initials: 'DB' },
    ];

    return [
      {
        id: '1',
        title: 'Food Research',
        description:
          "Food design is required for our new project let's research the best practices",
        status: TaskStatus.BACKLOG,
        daysRemaining: 12,
        assignees: [mockAssignees[0], mockAssignees[1], mockAssignees[2]],
        attachments: 5,
        comments: 8,
        priority: TaskPriority.HIGH,
        createdDate: new Date('2024-06-01'),
        dueDate: new Date('2024-06-27'),
      },
      {
        id: '2',
        title: 'Mockups',
        description: 'Create mockups for mobile android and iOS pro max',
        status: TaskStatus.BACKLOG,
        daysRemaining: 12,
        assignees: [mockAssignees[3], mockAssignees[4], mockAssignees[0]],
        attachments: 4,
        comments: 6,
        priority: TaskPriority.MEDIUM,
        createdDate: new Date('2024-06-02'),
        dueDate: new Date('2024-06-27'),
      },
      {
        id: '3',
        title: 'UI Animation',
        description:
          'Micro interaction loading and progress library fitting the design',
        status: TaskStatus.BACKLOG,
        daysRemaining: 12,
        assignees: [mockAssignees[1], mockAssignees[2], mockAssignees[3]],
        attachments: 2,
        comments: 4,
        priority: TaskPriority.LOW,
        createdDate: new Date('2024-06-03'),
        dueDate: new Date('2024-06-27'),
      },
      {
        id: '4',
        title: 'User Interface',
        description: 'Design new user interface design for food delivery app',
        status: TaskStatus.IN_PROGRESS,
        daysRemaining: 12,
        assignees: [mockAssignees[2], mockAssignees[3], mockAssignees[4]],
        attachments: 3,
        comments: 4,
        priority: TaskPriority.HIGH,
        createdDate: new Date('2024-06-04'),
        dueDate: new Date('2024-06-27'),
      },
      {
        id: '5',
        title: 'Usability Testing',
        description:
          'Complete usability testing for the new app and involve app',
        status: TaskStatus.IN_PROGRESS,
        daysRemaining: 12,
        assignees: [mockAssignees[0], mockAssignees[1], mockAssignees[4]],
        attachments: 4,
        comments: 3,
        priority: TaskPriority.MEDIUM,
        createdDate: new Date('2024-06-05'),
        dueDate: new Date('2024-06-27'),
      },
      {
        id: '6',
        title: 'Food Research',
        description:
          "Food design is required for our new project let's research the best practices",
        status: TaskStatus.IN_PROGRESS,
        daysRemaining: 12,
        assignees: [mockAssignees[2], mockAssignees[3], mockAssignees[4]],
        attachments: 5,
        comments: 0,
        priority: TaskPriority.HIGH,
        createdDate: new Date('2024-06-06'),
        dueDate: new Date('2024-06-27'),
      },
      {
        id: '7',
        title: 'Mind Mapping',
        description:
          'Mind mapping for the food delivery app for targeting young users',
        status: TaskStatus.COMPLETED,
        daysRemaining: 12,
        assignees: [mockAssignees[0], mockAssignees[1], mockAssignees[3]],
        attachments: 7,
        comments: 2,
        priority: TaskPriority.MEDIUM,
        createdDate: new Date('2024-06-07'),
        dueDate: new Date('2024-06-27'),
      },
      {
        id: '8',
        title: 'Food Research',
        description:
          "Food design is required for our new project let's research the best practices",
        status: TaskStatus.COMPLETED,
        daysRemaining: 12,
        assignees: [mockAssignees[0], mockAssignees[2], mockAssignees[4]],
        attachments: 5,
        comments: 5,
        priority: TaskPriority.HIGH,
        createdDate: new Date('2024-06-08'),
        dueDate: new Date('2024-06-27'),
      },
      {
        id: '9',
        title: 'User Feedback',
        description:
          'Perform the user survey and take necessary steps to solve their problem with existing one',
        status: TaskStatus.COMPLETED,
        daysRemaining: 12,
        assignees: [mockAssignees[1], mockAssignees[3], mockAssignees[4]],
        attachments: 5,
        comments: 8,
        priority: TaskPriority.MEDIUM,
        createdDate: new Date('2024-06-09'),
        dueDate: new Date('2024-06-27'),
      },
    ];
  }
}
