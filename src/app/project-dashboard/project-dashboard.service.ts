// project.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import {
  Project,
  TeamMember,
  ProjectStatus,
  PaginationData,
} from './project-dashboard.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  public projects$ = this.projectsSubject.asObservable();

  private mockProjects: Project[] = [
    {
      id: '1',
      title: 'Adoddle',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      status: ProjectStatus.OFF_TRACK,
      createdDate: new Date('2023-04-05'),
      teamMembers: this.generateMockTeamMembers(4),
      issueCount: 14,
      isOffTrack: true,
    },
    {
      id: '2',
      title: 'Adoddle',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      status: ProjectStatus.OFF_TRACK,
      createdDate: new Date('2023-04-05'),
      teamMembers: this.generateMockTeamMembers(4),
      issueCount: 14,
      isOffTrack: true,
    },
    {
      id: '3',
      title: 'Adoddle',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      status: ProjectStatus.OFF_TRACK,
      createdDate: new Date('2023-04-05'),
      teamMembers: this.generateMockTeamMembers(4),
      issueCount: 14,
      isOffTrack: true,
    },
    {
      id: '4',
      title: 'Adoddle',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      status: ProjectStatus.OFF_TRACK,
      createdDate: new Date('2023-04-05'),
      teamMembers: this.generateMockTeamMembers(4),
      issueCount: 14,
      isOffTrack: true,
    },
    {
      id: '5',
      title: 'Adoddle',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      status: ProjectStatus.OFF_TRACK,
      createdDate: new Date('2023-04-05'),
      teamMembers: this.generateMockTeamMembers(4),
      issueCount: 14,
      isOffTrack: true,
    },
    {
      id: '6',
      title: 'Adoddle',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      status: ProjectStatus.OFF_TRACK,
      createdDate: new Date('2023-04-05'),
      teamMembers: this.generateMockTeamMembers(4),
      issueCount: 14,
      isOffTrack: true,
    },
  ];

  constructor() {
    this.projectsSubject.next(this.mockProjects);
  }

  getProjects(
    page: number = 1,
    pageSize: number = 6
  ): Observable<{ projects: Project[]; pagination: PaginationData }> {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProjects = this.mockProjects.slice(startIndex, endIndex);

    const pagination: PaginationData = {
      currentPage: page,
      totalPages: Math.ceil(this.mockProjects.length / pageSize),
      totalItems: this.mockProjects.length,
      itemsPerPage: pageSize,
    };

    return of({ projects: paginatedProjects, pagination }).pipe(delay(300));
  }

  createProject(project: Omit<Project, 'id'>): Observable<Project> {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
    };

    this.mockProjects.unshift(newProject);
    this.projectsSubject.next([...this.mockProjects]);

    return of(newProject).pipe(delay(300));
  }

  updateProject(id: string, updates: Partial<Project>): Observable<Project> {
    const index = this.mockProjects.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.mockProjects[index] = { ...this.mockProjects[index], ...updates };
      this.projectsSubject.next([...this.mockProjects]);
      return of(this.mockProjects[index]).pipe(delay(300));
    }
    throw new Error('Project not found');
  }

  deleteProject(id: string): Observable<boolean> {
    const index = this.mockProjects.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.mockProjects.splice(index, 1);
      this.projectsSubject.next([...this.mockProjects]);
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }

  private generateMockTeamMembers(count: number): TeamMember[] {
    const colors = [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#96CEB4',
      '#FFEAA7',
      '#DDA0DD',
    ];
    const members: TeamMember[] = [];

    for (let i = 0; i < count; i++) {
      members.push({
        id: `member-${i}`,
        name: `Team Member ${i + 1}`,
        avatar: colors[i % colors.length],
        role: i === 0 ? 'Lead' : 'Developer',
      });
    }

    return members;
  }
}
