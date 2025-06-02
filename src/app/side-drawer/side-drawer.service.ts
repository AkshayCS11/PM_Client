import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MenuItem, NavigationEvent } from './side-drawer.interface';

@Injectable({
  providedIn: 'root',
})
export class SideDrawerService {
  private activeItemSubject = new BehaviorSubject<string>('Performance');
  private navigationSubject = new BehaviorSubject<NavigationEvent | null>(null);

  public activeItem$ = this.activeItemSubject.asObservable();
  public navigation$ = this.navigationSubject.asObservable();

  private menuItems: MenuItem[] = [
    {
      id: 'project',
      label: 'Project',
      icon: '📋',
      route: '/project',
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: '👤',
      route: '/tasks',
    },
    {
      id: 'work-logs',
      label: 'Work Logs',
      icon: '📄',
      route: '/work-logs',
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: '⚙️',
      route: '/performance',
      isActive: true,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      route: '/settings',
    },
  ];

  constructor() {}

  getMenuItems(): MenuItem[] {
    return this.menuItems.map((item) => ({
      ...item,
      isActive: item.label === this.activeItemSubject.value,
    }));
  }

  setActiveItem(label: string): void {
    const previousActive = this.activeItemSubject.value;
    const currentItem = this.menuItems.find((item) => item.label === label);
    const previousItem = this.menuItems.find(
      (item) => item.label === previousActive
    );

    this.activeItemSubject.next(label);

    if (currentItem) {
      this.navigationSubject.next({
        item: currentItem,
        previousItem: previousItem,
      });
    }
  }

  getActiveItem(): string {
    return this.activeItemSubject.value;
  }

  getItemById(id: string): MenuItem | undefined {
    return this.menuItems.find((item) => item.id === id);
  }

  getItemByLabel(label: string): MenuItem | undefined {
    return this.menuItems.find((item) => item.label === label);
  }

  updateMenuItem(id: string, updates: Partial<MenuItem>): void {
    const index = this.menuItems.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.menuItems[index] = { ...this.menuItems[index], ...updates };
    }
  }

  addMenuItem(item: MenuItem): void {
    this.menuItems.push(item);
  }

  removeMenuItem(id: string): void {
    this.menuItems = this.menuItems.filter((item) => item.id !== id);
  }
}
