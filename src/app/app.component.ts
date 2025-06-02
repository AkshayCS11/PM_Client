import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { TaskCreationFormComponent } from './task-creation-form/task-creation-form.component';
import { SideDrawerComponent } from './side-drawer/side-drawer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    TaskCreationFormComponent,
    SideDrawerComponent,
  ],
  template: `
    <app-navbar></app-navbar>
    <div class="app-container">
      <div class="content-row">
        <div class="drawer-section">
          <app-side-drawer></app-side-drawer>
        </div>
        <div class="form-section">
          <h1>Task Creation Form</h1>
          <app-task-creation-form></app-task-creation-form>
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
        height: calc(100vh - 64px); /* Assuming navbar height is 64px */
      }

      .form-section {
        flex: 1;
        min-width: 0;
        padding: 20px;
      }

      .drawer-section {
        flex: 0 0 300px; /* Fixed width of 300px, no grow/shrink */
        min-width: 300px;
      }

      /* Responsive design for smaller screens */
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
export class AppComponent {
  title = 'task-management-system';
}
