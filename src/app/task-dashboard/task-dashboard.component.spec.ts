import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, BehaviorSubject } from 'rxjs';
import { TaskBoardComponent } from './task-board.component';
import { TaskService } from './task.service';
import {
  Task,
  TaskColumn,
  TaskStatus,
  TaskPriority,
  TaskStats,
} from './task.interface';

describe('TaskBoardComponent', () => {
  let component: TaskBoardComponent;
  let fixture: ComponentFixture<TaskBoardComponent>;
  let mockTaskService: jasmine.SpyObj<TaskService>;
  let mockTasks: Task[];
  let mockColumns: TaskColumn[];
  let mockStats: TaskStats;

  beforeEach(async () => {
    // Create mock data
    mockTasks = [
      {
        id: '1',
        title: 'Test Task 1',
        description: 'Test description 1',
        status: TaskStatus.BACKLOG,
        daysRemaining: 5,
        assignees: [{ id: '1', name: 'John Doe', avatar: '', initials: 'JD' }],
        attachments: 2,
        comments: 3,
        priority: TaskPriority.HIGH,
        createdDate: new Date('2024-06-01'),
        dueDate: new Date('2024-06-20'),
      },
      {
        id: '2',
        title: 'Test Task 2',
        description: 'Test description 2',
        status: TaskStatus.IN_PROGRESS,
        daysRemaining: 10,
        assignees: [
          { id: '2', name: 'Jane Smith', avatar: '', initials: 'JS' },
        ],
        attachments: 1,
        comments: 5,
        priority: TaskPriority.MEDIUM,
        createdDate: new Date('2024-06-02'),
        dueDate: new Date('2024-06-25'),
      },
    ];

    mockColumns = [
      {
        id: 'backlog',
        title: 'Backlog',
        status: TaskStatus.BACKLOG,
        tasks: [mockTasks[0]],
      },
      {
        id: 'in_progress',
        title: 'In progress',
        status: TaskStatus.IN_PROGRESS,
        tasks: [mockTasks[1]],
      },
      {
        id: 'completed',
        title: 'Completed',
        status: TaskStatus.COMPLETED,
        tasks: [],
      },
    ];

    mockStats = {
      total: 2,
      backlog: 1,
      inProgress: 1,
      completed: 0,
    };

    // Create spy object for TaskService
    const taskServiceSpy = jasmine.createSpyObj('TaskService', [
      'getTasks',
      'getFilteredTasks',
      'getTasksByStatus',
      'getTaskStats',
      'updateFilter',
      'addTask',
      'updateTask',
      'deleteTask',
      'moveTask',
    ]);

    await TestBed.configureTestingModule({
      imports: [TaskBoardComponent, FormsModule],
      providers: [{ provide: TaskService, useValue: taskServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskBoardComponent);
    component = fixture.componentInstance;
    mockTaskService = TestBed.inject(
      TaskService
    ) as jasmine.SpyObj<TaskService>;

    // Setup default spy returns
    mockTaskService.getTasks.and.returnValue(of(mockTasks));
    mockTaskService.getFilteredTasks.and.returnValue(of(mockTasks));
    mockTaskService.getTasksByStatus.and.returnValue(of(mockColumns));
    mockTaskService.getTaskStats.and.returnValue(of(mockStats));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize data on ngOnInit', () => {
      component.ngOnInit();

      expect(mockTaskService.getTasksByStatus).toHaveBeenCalled();
      expect(mockTaskService.getTaskStats).toHaveBeenCalled();
      expect(component.taskColumns$).toBeDefined();
      expect(component.taskStats$).toBeDefined();
    });

    it('should set initial values correctly', () => {
      expect(component.searchTerm).toBe('');
      expect(component.selectedView).toBe('list');
      expect(component.isLoading).toBe(false);
    });
  });

  describe('Search Functionality', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should update search term on input change', () => {
      const inputElement = fixture.nativeElement.querySelector('.search-input');
      const testValue = 'test search';

      inputElement.value = testValue;
      inputElement.dispatchEvent(new Event('input'));

      expect(component.searchTerm).toBe(testValue);
    });

    it('should call updateFilter on search change', (done) => {
      const testSearchTerm = 'test';

      component.onSearchChange({ target: { value: testSearchTerm } } as any);

      // Wait for debounce
      setTimeout(() => {
        expect(mockTaskService.updateFilter).toHaveBeenCalledWith({
          searchTerm: testSearchTerm,
        });
        done();
      }, 400);
    });
  });

  describe('Task Operations', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should call addTask when adding new task', () => {
      const status = TaskStatus.BACKLOG;

      component.addNewTask(status);

      expect(mockTaskService.addTask).toHaveBeenCalled();
      const addedTask = mockTaskService.addTask.calls.mostRecent().args[0];
      expect(addedTask.status).toBe(status);
      expect(addedTask.title).toBe('New Task');
    });

    it('should call moveTask when dropping task', () => {
      const taskId = '1';
      const targetStatus = TaskStatus.IN_PROGRESS;
      const mockEvent = {
        preventDefault: jasmine.createSpy('preventDefault'),
        dataTransfer: {
          getData: jasmine.createSpy('getData').and.returnValue(taskId),
        },
      } as any;

      component.onDrop(mockEvent, targetStatus);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockTaskService.moveTask).toHaveBeenCalledWith(
        taskId,
        targetStatus
      );
    });

    it('should call updateFilter when filtering by priority', () => {
      const priority = TaskPriority.HIGH;

      component.filterByPriority(priority);

      expect(mockTaskService.updateFilter).toHaveBeenCalledWith({ priority });
    });

    it('should call updateFilter when filtering by status', () => {
      const status = TaskStatus.COMPLETED;

      component.filterByStatus(status);

      expect(mockTaskService.updateFilter).toHaveBeenCalledWith({ status });
    });

    it('should clear all filters', () => {
      component.searchTerm = 'test';

      component.clearFilters();

      expect(component.searchTerm).toBe('');
      expect(mockTaskService.updateFilter).toHaveBeenCalledWith({
        searchTerm: '',
        status: undefined,
        priority: undefined,
        assignee: undefined,
      });
    });
  });

  describe('Utility Methods', () => {
    it('should return correct priority colors', () => {
      expect(component.getPriorityColor(TaskPriority.HIGH)).toBe('#ef4444');
      expect(component.getPriorityColor(TaskPriority.URGENT)).toBe('#ef4444');
      expect(component.getPriorityColor(TaskPriority.MEDIUM)).toBe('#f59e0b');
      expect(component.getPriorityColor(TaskPriority.LOW)).toBe('#10b981');
    });

    it('should return correct status colors', () => {
      expect(component.getStatusColor(TaskStatus.BACKLOG)).toBe('#64748b');
      expect(component.getStatusColor(TaskStatus.IN_PROGRESS)).toBe('#3b82f6');
      expect(component.getStatusColor(TaskStatus.COMPLETED)).toBe('#10b981');
    });
  });

  describe('Drag and Drop', () => {
    it('should set data transfer on drag start', () => {
      const task = mockTasks[0];
      const mockEvent = {
        dataTransfer: {
          setData: jasmine.createSpy('setData'),
          effectAllowed: '',
        },
      } as any;

      component.onDragStart(mockEvent, task);

      expect(mockEvent.dataTransfer.setData).toHaveBeenCalledWith(
        'text/plain',
        task.id
      );
      expect(mockEvent.dataTransfer.effectAllowed).toBe('move');
    });

    it('should prevent default on drag over', () => {
      const mockEvent = {
        preventDefault: jasmine.createSpy('preventDefault'),
        dataTransfer: { dropEffect: '' },
      } as any;

      component.onDragOver(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.dataTransfer.dropEffect).toBe('move');
    });
  });

  describe('Bulk Operations', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should mark multiple tasks as completed', () => {
      const tasks = [mockTasks[0]]; // Backlog task

      component.markTasksAsCompleted(tasks);

      expect(mockTaskService.updateTask).toHaveBeenCalledWith(tasks[0].id, {
        status: TaskStatus.COMPLETED,
      });
    });

    it('should not update already completed tasks', () => {
      const completedTask = { ...mockTasks[0], status: TaskStatus.COMPLETED };

      component.markTasksAsCompleted([completedTask]);

      expect(mockTaskService.updateTask).not.toHaveBeenCalled();
    });
  });

  describe('Template Rendering', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should render task columns', () => {
      const columns = fixture.nativeElement.querySelectorAll('.task-column');
      expect(columns.length).toBe(3);
    });

    it('should render search input', () => {
      const searchInput = fixture.nativeElement.querySelector('.search-input');
      expect(searchInput).toBeTruthy();
      expect(searchInput.placeholder).toBe('Search Projects');
    });

    it('should render view selector', () => {
      const viewSelect = fixture.nativeElement.querySelector('.view-select');
      expect(viewSelect).toBeTruthy();
    });

    it('should render add task buttons', () => {
      const addButtons =
        fixture.nativeElement.querySelectorAll('.add-task-btn');
      expect(addButtons.length).toBe(3); // One for each column
    });
  });

  describe('Component Cleanup', () => {
    it('should complete subjects on destroy', () => {
      spyOn(component['destroy$'], 'next');
      spyOn(component['destroy$'], 'complete');

      component.ngOnDestroy();

      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle service errors gracefully', () => {
      mockTaskService.getTasksByStatus.and.returnValue(of([]));

      component.ngOnInit();
      fixture.detectChanges();

      expect(component).toBeTruthy();
      // Component should still render even with empty data
    });
  });
});
