export interface ProjectRole {
  name: string;
  role: string;
  selected: boolean;
}

export interface ProjectFormData {
  title: string;
  type: string;
  startDate: string;
  endDate: string;
  description: string;
  projectRoles: ProjectRole[];
}
