import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskCreationFormComponent } from './task-creation-form.component';

describe('TaskCreationFormComponent', () => {
  let component: TaskCreationFormComponent;
  let fixture: ComponentFixture<TaskCreationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCreationFormComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCreationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.taskForm.get('assignTo')?.value).toBe('yash-ghori');
    expect(component.taskForm.get('priority')?.value).toBe('high');
    expect(component.taskForm.get('taskAssigning')?.value).toBe('pending');
  });

  it('should validate required fields', () => {
    const form = component.taskForm;

    // Clear all fields
    form.patchValue({
      taskTitle: '',
      taskType: '',
      taskStartDate: '',
      taskEndDate: '',
      taskDescription: '',
      assignTo: '',
    });

    expect(form.invalid).toBeTruthy();
    expect(form.get('taskTitle')?.hasError('required')).toBeTruthy();
    expect(form.get('taskType')?.hasError('required')).toBeTruthy();
    expect(form.get('taskStartDate')?.hasError('required')).toBeTruthy();
    expect(form.get('taskEndDate')?.hasError('required')).toBeTruthy();
    expect(form.get('taskDescription')?.hasError('required')).toBeTruthy();
    expect(form.get('assignTo')?.hasError('required')).toBeTruthy();
  });

  it('should return true for invalid fields that are dirty or touched', () => {
    const taskTitleField = component.taskForm.get('taskTitle');
    taskTitleField?.setValue('');
    taskTitleField?.markAsTouched();

    expect(component.isFieldInvalid('taskTitle')).toBeTruthy();
  });

  it('should set priority correctly', () => {
    component.setPriority('medium');
    expect(component.taskForm.get('priority')?.value).toBe('medium');

    component.setPriority('low');
    expect(component.taskForm.get('priority')?.value).toBe('low');
  });

  it('should remove priority when removePriority is called', () => {
    component.taskForm.get('priority')?.setValue('high');

    const mockEvent = { stopPropagation: jasmine.createSpy() } as any;
    component.removePriority(mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(component.taskForm.get('priority')?.value).toBe('');
  });

  it('should set task assigning status correctly', () => {
    component.setTaskAssigning('in-progress');
    expect(component.taskForm.get('taskAssigning')?.value).toBe('in-progress');

    component.setTaskAssigning('completed');
    expect(component.taskForm.get('taskAssigning')?.value).toBe('completed');
  });

  it('should remove task assigning status when removeTaskAssigning is called', () => {
    component.taskForm.get('taskAssigning')?.setValue('pending');

    const mockEvent = { stopPropagation: jasmine.createSpy() } as any;
    component.removeTaskAssigning(mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(component.taskForm.get('taskAssigning')?.value).toBe('');
  });

  it('should submit form when valid', () => {
    spyOn(window, 'alert');
    spyOn(console, 'log');

    // Fill form with valid data
    component.taskForm.patchValue({
      taskTitle: 'Test Task',
      taskType: 'Development',
      taskStartDate: '2024-01-01',
      taskEndDate: '2024-01-15',
      taskDescription: 'Test description',
      assignTo: 'yash-ghori',
      priority: 'high',
      taskAssigning: 'pending',
    });

    component.onSubmit();

    expect(console.log).toHaveBeenCalledWith(
      'Form submitted:',
      jasmine.any(Object)
    );
    expect(window.alert).toHaveBeenCalledWith('Task created successfully!');
  });

  it('should not submit form when invalid', () => {
    spyOn(console, 'log');
    spyOn(component as any, 'markFormGroupTouched');

    // Clear required fields to make form invalid
    component.taskForm.patchValue({
      taskTitle: '',
      taskType: '',
      taskStartDate: '',
      taskEndDate: '',
      taskDescription: '',
      assignTo: '',
    });

    component.onSubmit();

    expect(console.log).toHaveBeenCalledWith('Form is invalid');
    expect((component as any).markFormGroupTouched).toHaveBeenCalled();
  });

  it('should reset form on delete confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(console, 'log');

    // Fill form with some data
    component.taskForm.patchValue({
      taskTitle: 'Test Task',
      taskType: 'Development',
    });

    component.onDelete();

    expect(window.confirm).toHaveBeenCalledWith(
      'Are you sure you want to delete this task?'
    );
    expect(console.log).toHaveBeenCalledWith('Task deleted');

    // Check if form is reset with default values
    expect(component.taskForm.get('assignTo')?.value).toBe('yash-ghori');
    expect(component.taskForm.get('priority')?.value).toBe('high');
    expect(component.taskForm.get('taskAssigning')?.value).toBe('pending');
  });

  it('should not reset form on delete cancellation', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    // Fill form with some data
    component.taskForm.patchValue({
      taskTitle: 'Test Task',
      taskType: 'Development',
    });

    const originalTitle = component.taskForm.get('taskTitle')?.value;

    component.onDelete();

    expect(window.confirm).toHaveBeenCalled();
    expect(component.taskForm.get('taskTitle')?.value).toBe(originalTitle);
  });

  it('should mark all form controls as touched', () => {
    const controls = component.taskForm.controls;

    // Ensure controls are not touched initially
    Object.keys(controls).forEach((key) => {
      controls[key].markAsUntouched();
    });

    (component as any).markFormGroupTouched();

    // Check all controls are now touched
    Object.keys(controls).forEach((key) => {
      expect(controls[key].touched).toBeTruthy();
    });
  });

  // Template tests
  it('should render form fields', () => {
    const compiled = fixture.nativeElement;

    expect(compiled.querySelector('#taskTitle')).toBeTruthy();
    expect(compiled.querySelector('#taskType')).toBeTruthy();
    expect(compiled.querySelector('#taskStartDate')).toBeTruthy();
    expect(compiled.querySelector('#taskEndDate')).toBeTruthy();
    expect(compiled.querySelector('#taskDescription')).toBeTruthy();
    expect(compiled.querySelector('#assignTo')).toBeTruthy();
  });

  it('should render priority tags', () => {
    const compiled = fixture.nativeElement;
    const priorityTags = compiled.querySelectorAll('.priority-tag');

    expect(priorityTags.length).toBe(3);
    expect(priorityTags[0].textContent.trim()).toContain('High');
    expect(priorityTags[1].textContent.trim()).toContain('Medium');
    expect(priorityTags[2].textContent.trim()).toContain('Low');
  });

  it('should render task assigning tags', () => {
    const compiled = fixture.nativeElement;
    const statusTags = compiled.querySelectorAll('.status-tag');

    expect(statusTags.length).toBe(3);
    expect(statusTags[0].textContent.trim()).toContain('Pending');
    expect(statusTags[1].textContent.trim()).toContain('In Progress');
    expect(statusTags[2].textContent.trim()).toContain('Completed');
  });

  it('should render action buttons', () => {
    const compiled = fixture.nativeElement;
    const buttons = compiled.querySelectorAll('.btn');

    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent.trim()).toBe('Delete');
    expect(buttons[1].textContent.trim()).toBe('Create');
  });

  it('should disable create button when form is invalid', () => {
    // Make form invalid
    component.taskForm.patchValue({
      taskTitle: '',
      taskType: '',
    });
    fixture.detectChanges();

    const createButton = fixture.nativeElement.querySelector('.btn-primary');
    expect(createButton.disabled).toBeTruthy();
  });

  it('should show error messages for invalid fields', () => {
    const taskTitleField = component.taskForm.get('taskTitle');
    taskTitleField?.setValue('');
    taskTitleField?.markAsTouched();
    fixture.detectChanges();

    const errorMessage = fixture.nativeElement.querySelector('.error-message');
    expect(errorMessage?.textContent.trim()).toBe('Task title is required');
  });
});
