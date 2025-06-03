import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  FormControl,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProjectCreationFormService } from './project-creation-form.service';
import { ProjectRole } from './project-creation-form.interface';

@Component({
  selector: 'app-project-creation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-creation-form.component.html',
  styleUrls: ['./project-creation-form.component.scss'],
})
export class ProjectCreationFormComponent {
  form: FormGroup;

  roles: ProjectRole[] = [
    { name: 'Yash', role: 'Team lead', selected: false },
    { name: 'Neha', role: 'Developer', selected: false },
    { name: 'Amit', role: 'Tester', selected: false },
    { name: 'Sana', role: 'Designer', selected: false },
    { name: 'Vikram', role: 'Product Owner', selected: false },
    { name: 'Riya', role: 'Scrum Master', selected: false },
  ];

  constructor(
    private fb: FormBuilder,
    private service: ProjectCreationFormService
  ) {
    this.form = this.fb.group({
      title: [''],
      type: [''],
      startDate: [''],
      endDate: [''],
      description: [''],
      projectRoles: this.fb.array(
        this.roles.map((r) =>
          this.fb.group({
            name: [r.name],
            role: [r.role],
            selected: [r.selected],
          })
        )
      ),
    });
  }

  get projectRoles(): FormArray {
    return this.form.get('projectRoles') as FormArray;
  }

  getProjectRoleGroup(index: number): FormGroup {
    return this.projectRoles.at(index) as FormGroup;
  }

  onCreate() {
    if (this.form.valid) {
      // this.service.createProject(this.form.value).subscribe(console.log);
    }
  }

  onDelete() {
    this.form.reset();
  }
}
