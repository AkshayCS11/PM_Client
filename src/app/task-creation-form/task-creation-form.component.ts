import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskCreationFormData } from './task-creation-form.interface';

@Component({
  selector: 'app-task-creation-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-creation-form.component.html',
  styleUrls: ['./task-creation-form.component.css'],
})
export class TaskCreationFormComponent implements OnInit {
  taskForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      taskTitle: ['', Validators.required],
      taskType: ['', Validators.required],
      taskStartDate: ['', Validators.required],
      taskEndDate: ['', Validators.required],
      taskDescription: ['', Validators.required],
      assignTo: ['', Validators.required],
      priority: [''],
      taskAssigning: [''],
    });
  }

  ngOnInit(): void {
    // Set default values to match the image
    this.taskForm.patchValue({
      assignTo: 'yash-ghori',
      priority: 'high',
      taskAssigning: 'pending',
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.taskForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  setPriority(priority: string): void {
    this.taskForm.patchValue({ priority });
  }

  removePriority(event: Event): void {
    event.stopPropagation();
    this.taskForm.patchValue({ priority: '' });
  }

  setTaskAssigning(status: string): void {
    this.taskForm.patchValue({ taskAssigning: status });
  }

  removeTaskAssigning(event: Event): void {
    event.stopPropagation();
    this.taskForm.patchValue({ taskAssigning: '' });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const formData: TaskCreationFormData = this.taskForm.value;
      console.log('Form submitted:', formData);
      // Here you would typically send the data to your service
      alert('Task created successfully!');
    } else {
      console.log('Form is invalid');
      this.markFormGroupTouched();
    }
  }

  onDelete(): void {
    if (confirm('Are you sure you want to delete this task?')) {
      console.log('Task deleted');
      this.taskForm.reset();
      // Set default values again after reset
      this.taskForm.patchValue({
        assignTo: 'yash-ghori',
        priority: 'high',
        taskAssigning: 'pending',
      });
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.taskForm.controls).forEach((key) => {
      const control = this.taskForm.get(key);
      control?.markAsTouched();
    });
  }
}
