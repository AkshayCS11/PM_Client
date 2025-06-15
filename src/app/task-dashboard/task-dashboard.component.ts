import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Observable,
  Subject,
  debounceTime,
  distinctUntilChanged,
  takeUntil,
} from 'rxjs';
import { TaskService } from './task-dashboard.service';
import {
  Task,
  TaskColumn,
  TaskStatus,
  TaskPriority,
  TaskStats,
} from './task-dashboard.interface';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-dashboard.component.html',
  styleUrls: ['./task-dashboard.component.scss'],
})
export class TaskBoardComponent implements OnInit, OnDestroy {
  // Observables
  taskColumns$!: Observable<TaskColumn[]>;
  taskStats$!: Observable<TaskStats>;

  // Component state
  searchTerm: string = '';
  selectedView: string = 'list';
  isLoading: boolean = false;

  // Search subject for debouncing
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.initializeData();
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeData(): void {
    this.taskColumns$ = this.taskService.getTasksByStatus();
    this.taskStats$ = this.taskService.getTaskStats();
  }

  private setupSearch(): void {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((searchTerm) => {
        this.taskService.updateFilter({ searchTerm });
      });
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.searchSubject.next(this.searchTerm);
  }

  showColumnMenu(columnId: string): void {
    // Implement column menu functionality
    console.log('Show menu for column:', columnId);
    // This could open a dropdown menu with options like:
    // - Add new task
    // - Clear completed tasks
    // - Sort tasks
    // - Column settings
  }

  openTaskDetails(task: Task): void {
    // Implement task details modal/page
    console.log('Open task details:', task);
    // This could open a detailed view with:
    // - Full task description
    // - Comments section
    // - Attachments list
    // - Activity history
    // - Edit capabilities
  }

  addAssignee(task: Task): void {
    // Implement add assignee functionality
    console.log('Add assignee to task:', task.id);
    // This could open a user picker modal or dropdown
    // For demo purposes, we'll just log
  }

  addNewTask(status: TaskStatus): void {
    // Implement add new task functionality
    console.log('Add new task to column:', status);

    // For demo, create a basic task
    const newTask = {
      title: 'New Task',
      description: 'Task description here...',
      status: status,
      daysRemaining: 7,
      assignees: [],
      attachments: 0,
      comments: 0,
      priority: TaskPriority.MEDIUM,
      createdDate: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    };

    this.taskService.addTask(newTask);
  }

  // Utility methods for template
  getPriorityColor(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.HIGH:
      case TaskPriority.URGENT:
        return '#ef4444';
      case TaskPriority.MEDIUM:
        return '#f59e0b';
      case TaskPriority.LOW:
        return '#10b981';
      default:
        return '#64748b';
    }
  }

  getStatusColor(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.BACKLOG:
        return '#64748b';
      case TaskStatus.IN_PROGRESS:
        return '#3b82f6';
      case TaskStatus.COMPLETED:
        return '#10b981';
      default:
        return '#64748b';
    }
  }

  // Drag and drop methods (for future enhancement)
  onDragStart(event: DragEvent, task: Task): void {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', task.id);
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
  }

  onDrop(event: DragEvent, targetStatus: TaskStatus): void {
    event.preventDefault();
    const taskId = event.dataTransfer?.getData('text/plain');

    if (taskId) {
      this.taskService.moveTask(taskId, targetStatus);
    }
  }

  // Filter methods
  filterByPriority(priority: TaskPriority): void {
    this.taskService.updateFilter({ priority });
  }

  filterByStatus(status: TaskStatus): void {
    this.taskService.updateFilter({ status });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.taskService.updateFilter({
      searchTerm: '',
      status: undefined,
      priority: undefined,
      assignee: undefined,
    });
  }

  // Bulk operations
  markTasksAsCompleted(tasks: Task[]): void {
    tasks.forEach((task) => {
      if (task.status !== TaskStatus.COMPLETED) {
        this.taskService.updateTask(task.id, { status: TaskStatus.COMPLETED });
      }
    });
  }

  deleteCompletedTasks(): void {
    // This would typically show a confirmation dialog first
    this.taskService.getTasks().subscribe((tasks) => {
      const completedTasks = tasks.filter(
        (task) => task.status === TaskStatus.COMPLETED
      );
      completedTasks.forEach((task) => {
        this.taskService.deleteTask(task.id);
      });
    });
  }

  // Export/Import methods
  exportTasks(): void {
    this.taskService.getTasks().subscribe((tasks) => {
      const dataStr = JSON.stringify(tasks, null, 2);
      const dataUri =
        'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

      const exportFileDefaultName = `tasks-export-${
        new Date().toISOString().split('T')[0]
      }.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    });
  }

  // Keyboard shortcuts (for future enhancement)
  onKeydown(event: KeyboardEvent): void {
    // Implement keyboard shortcuts
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'k':
          event.preventDefault();
          // Focus search input
          const searchInput = document.querySelector(
            '.search-input'
          ) as HTMLInputElement;
          searchInput?.focus();
          break;
        case 'n':
          event.preventDefault();
          // Add new task to backlog
          this.addNewTask(TaskStatus.BACKLOG);
          break;
      }
    }
  }
}
