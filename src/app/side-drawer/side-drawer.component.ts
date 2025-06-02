import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideDrawerService } from './side-drawer.service';
import { MenuItem } from './side-drawer.interface';

@Component({
  selector: 'app-side-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-drawer.component.html',
  styleUrls: ['./side-drawer.component.css'],
})
export class SideDrawerComponent implements OnInit {
  menuItems: MenuItem[] = [];
  activeItem: string = 'Performance';

  constructor(private sideDrawerService: SideDrawerService) {}

  ngOnInit(): void {
    this.menuItems = this.sideDrawerService.getMenuItems();
  }

  onItemClick(item: MenuItem): void {
    this.activeItem = item.label;
    this.sideDrawerService.setActiveItem(item.label);
  }

  isActive(item: MenuItem): boolean {
    return this.activeItem === item.label;
  }
}
