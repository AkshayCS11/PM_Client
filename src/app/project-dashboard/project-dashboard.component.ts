// project-dashboard.component.ts
import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { ProjectService } from './project-dashboard.service';
import { Project, PaginationData } from './project-dashboard.interface';

@Component({
  selector: 'app-project-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-dashboard.component.html',
  styleUrls: ['./project-dashboard.component.css'],
})
export class ProjectDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Signals for reactive state management
  projects = signal<Project[]>([]);
  pagination = signal<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 6,
  });
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Computed signals
  hasProjects = computed(() => this.projects().length > 0);
  hasPagination = computed(() => this.pagination().totalPages > 1);
  paginationNumbers = computed(() => {
    const totalPages = this.pagination().totalPages;
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  });

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProjects(page: number = 1): void {
    this.loading.set(true);
    this.error.set(null);

    this.projectService
      .getProjects(page, 6)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.projects.set(response.projects);
          this.pagination.set(response.pagination);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to load projects. Please try again.');
          this.loading.set(false);
          console.error('Error loading projects:', err);
        },
      });
  }

  onCreateProject(): void {
    // This would typically open a modal or navigate to a create form
    console.log('Create project clicked');
    // For demo purposes, we'll just reload the projects
    this.loadProjects();
  }

  onEditProject(project: Project): void {
    console.log('Edit project:', project);
    // Implementation for editing project
  }

  onDeleteProject(projectId: string): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService
        .deleteProject(projectId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (success) => {
            if (success) {
              this.loadProjects(this.pagination().currentPage);
            }
          },
          error: (err) => {
            this.error.set('Failed to delete project. Please try again.');
            console.error('Error deleting project:', err);
          },
        });
    }
  }

  onPageChange(page: number): void {
    if (
      page !== this.pagination().currentPage &&
      page >= 1 &&
      page <= this.pagination().totalPages
    ) {
      this.loadProjects(page);
    }
  }

  onPreviousPage(): void {
    const currentPage = this.pagination().currentPage;
    if (currentPage > 1) {
      this.onPageChange(currentPage - 1);
    }
  }

  onNextPage(): void {
    const currentPage = this.pagination().currentPage;
    const totalPages = this.pagination().totalPages;
    if (currentPage < totalPages) {
      this.onPageChange(currentPage + 1);
    }
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
      .format(new Date(date))
      .toUpperCase();
  }

  getVisibleTeamMembers(project: Project): any[] {
    const maxVisible = 3;
    const members = project.teamMembers.slice(0, maxVisible);
    const remainingCount = Math.max(0, project.teamMembers.length - maxVisible);

    return members
      .map((member) => ({
        ...member,
        isOverflow: false,
      }))
      .concat(
        remainingCount > 0
          ? [
              {
                id: 'overflow',
                name: `+${remainingCount}`,
                avatar: '#E0E0E0',
                isOverflow: true,
              },
            ]
          : []
      );
  }

  trackByProjectId(index: number, project: Project): string {
    return project.id;
  }

  trackByMemberId(index: number, member: any): string {
    return member.id;
  }
}
