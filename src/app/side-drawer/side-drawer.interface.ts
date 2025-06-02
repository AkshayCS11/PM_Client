export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  isActive?: boolean;
}

export interface SideDrawerConfig {
  width?: string;
  backgroundColor?: string;
  activeColor?: string;
  hoverColor?: string;
}

export interface NavigationEvent {
  item: MenuItem;
  previousItem?: MenuItem;
}
