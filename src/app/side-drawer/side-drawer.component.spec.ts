import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SideDrawerComponent } from './side-drawer.component';
import { SideDrawerService } from './side-drawer.service';
import { MenuItem } from './side-drawer.interface';

describe('SideDrawerComponent', () => {
  let component: SideDrawerComponent;
  let fixture: ComponentFixture<SideDrawerComponent>;
  let service: SideDrawerService;
  let mockMenuItems: MenuItem[];

  beforeEach(async () => {
    mockMenuItems = [
      { id: 'project', label: 'Project', icon: '📋', route: '/project' },
      { id: 'tasks', label: 'Tasks', icon: '👤', route: '/tasks' },
      {
        id: 'performance',
        label: 'Performance',
        icon: '⚙️',
        route: '/performance',
      },
    ];

    await TestBed.configureTestingModule({
      imports: [SideDrawerComponent],
      providers: [SideDrawerService],
    }).compileComponents();

    fixture = TestBed.createComponent(SideDrawerComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(SideDrawerService);

    spyOn(service, 'getMenuItems').and.returnValue(mockMenuItems);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with menu items from service', () => {
    expect(service.getMenuItems).toHaveBeenCalled();
    expect(component.menuItems).toEqual(mockMenuItems);
  });

  it('should set default active item to Performance', () => {
    expect(component.activeItem).toBe('Performance');
  });

  it('should render all menu items', () => {
    const menuElements = fixture.debugElement.queryAll(By.css('.menu-item'));
    expect(menuElements.length).toBe(mockMenuItems.length);
  });

  it('should display correct labels for menu items', () => {
    const labelElements = fixture.debugElement.queryAll(By.css('.label'));
    const labels = labelElements.map((el) =>
      el.nativeElement.textContent.trim()
    );

    expect(labels).toContain('Project');
    expect(labels).toContain('Tasks');
    expect(labels).toContain('Performance');
  });

  it('should apply active class to active item', () => {
    component.activeItem = 'Project';
    fixture.detectChanges();

    const activeElement = fixture.debugElement.query(
      By.css('.menu-item.active')
    );
    const labelElement = activeElement.query(By.css('.label'));

    expect(labelElement.nativeElement.textContent.trim()).toBe('Project');
  });

  it('should call onItemClick when menu item is clicked', () => {
    spyOn(component, 'onItemClick');

    const firstMenuItem = fixture.debugElement.query(By.css('.menu-item'));
    firstMenuItem.triggerEventHandler('click', null);

    expect(component.onItemClick).toHaveBeenCalledWith(mockMenuItems[0]);
  });

  it('should update active item when onItemClick is called', () => {
    spyOn(service, 'setActiveItem');

    const testItem = mockMenuItems[1]; // Tasks
    component.onItemClick(testItem);

    expect(component.activeItem).toBe('Tasks');
    expect(service.setActiveItem).toHaveBeenCalledWith('Tasks');
  });

  it('should return true for isActive when item matches activeItem', () => {
    component.activeItem = 'Project';
    const projectItem = mockMenuItems[0];

    expect(component.isActive(projectItem)).toBeTruthy();
  });

  it('should return false for isActive when item does not match activeItem', () => {
    component.activeItem = 'Project';
    const tasksItem = mockMenuItems[1];

    expect(component.isActive(tasksItem)).toBeFalsy();
  });

  it('should handle empty menu items gracefully', () => {
    spyOn(service, 'getMenuItems').and.returnValue([]);
    component.ngOnInit();

    expect(component.menuItems).toEqual([]);

    const menuElements = fixture.debugElement.queryAll(By.css('.menu-item'));
    expect(menuElements.length).toBe(0);
  });

  it('should render icons for menu items', () => {
    const iconElements = fixture.debugElement.queryAll(By.css('.icon'));
    expect(iconElements.length).toBe(mockMenuItems.length);
  });

  describe('CSS Classes', () => {
    it('should have correct CSS classes on container', () => {
      const container = fixture.debugElement.query(By.css('.side-drawer'));
      expect(container).toBeTruthy();
    });

    it('should have correct CSS classes on navigation', () => {
      const nav = fixture.debugElement.query(By.css('.drawer-nav'));
      expect(nav).toBeTruthy();
    });

    it('should have correct CSS classes on menu list', () => {
      const menuList = fixture.debugElement.query(By.css('.menu-list'));
      expect(menuList).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper structure for screen readers', () => {
      const nav = fixture.debugElement.query(By.css('nav'));
      const list = fixture.debugElement.query(By.css('ul'));
      const items = fixture.debugElement.queryAll(By.css('li'));

      expect(nav).toBeTruthy();
      expect(list).toBeTruthy();
      expect(items.length).toBe(mockMenuItems.length);
    });
  });
});
