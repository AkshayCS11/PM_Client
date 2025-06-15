import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { TaskCreationFormComponent } from './task-creation-form/task-creation-form.component';
import { SideDrawerComponent } from './side-drawer/side-drawer.component';
import { ProjectCreationFormComponent } from './project-creation-form/project-creation-form.component';
import { SideDrawerService } from './side-drawer/side-drawer.service';
import { ProjectDashboardComponent } from './project-dashboard/project-dashboard.component';
import { TaskBoardComponent } from "./task-dashboard/task-dashboard.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HttpClientModule,
    NavbarComponent,
    TaskCreationFormComponent,
    ProjectCreationFormComponent,
    SideDrawerComponent,
    ProjectDashboardComponent,
    TaskBoardComponent
],
  template: `
  <app-task-board></app-task-board>
    <app-navbar></app-navbar>
    <div class="app-container">
      <div class="content-row">
        <div class="drawer-section">
          <app-side-drawer></app-side-drawer>
        </div>
        <div class="form-section">
          <h1>{{ activeItem }}</h1>
          <ng-container [ngSwitch]="activeItem">
            <app-task-creation-form
              *ngSwitchCase="'Tasks'"
            ></app-task-creation-form>
            <!-- <app-project-creation-form
              *ngSwitchCase="'Project'"
            ></app-project-creation-form> -->
            <app-project-dashboard
              *ngSwitchCase="'Project'"
            ></app-project-dashboard>
            <p *ngSwitchCase="'Work Logs'">Work Logs component placeholder</p>
            <p *ngSwitchCase="'Performance'">
              Performance component placeholder
            </p>
            <p *ngSwitchCase="'Settings'">Settings component placeholder</p>
            <p *ngSwitchDefault>Select a section from the side drawer.</p>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .app-container {
        min-height: 100vh;
        background-color: #f9fafb;
        padding: 0;
      }

      h1 {
        text-align: center;
        color: #1f2937;
        margin-bottom: 2rem;
        font-size: 2rem;
        font-weight: 600;
      }

      .content-row {
        display: flex;
        gap: 2rem;
        align-items: flex-start;
        height: calc(100vh - 64px);
      }

      .form-section {
        flex: 1;
        min-width: 0;
        padding: 20px;
      }

      .drawer-section {
        flex: 0 0 300px;
        min-width: 300px;
      }

      @media (max-width: 768px) {
        .content-row {
          flex-direction: column;
        }

        .drawer-section {
          min-width: unset;
        }
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  activeItem: string = '';

  constructor(private sideDrawerService: SideDrawerService) {}

  ngOnInit(): void {
    this.sideDrawerService.activeItem$.subscribe((label) => {
      this.activeItem = label;
    });
  }
}
