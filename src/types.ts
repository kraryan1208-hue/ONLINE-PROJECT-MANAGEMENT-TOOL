export type UserRole = 'ADMIN' | 'PROJECT_MANAGER' | 'TEAM_MEMBER';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at?: string;
}

export type ProjectStatus = 'Planning' | 'In Progress' | 'Completed' | 'On Hold';

export interface Project {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: ProjectStatus;
  manager_id: number;
  manager_name?: string;
  manager_email?: string;
  created_at?: string;
  total_tasks: number;
  completed_tasks: number;
  in_progress_tasks: number;
  pending_tasks: number;
  progress_percentage: number;
}

export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface Task {
  id: number;
  title: string;
  description: string;
  project_id: number;
  project_title?: string;
  assigned_to: number;
  assignee_name?: string;
  assignee_email?: string;
  priority: TaskPriority;
  deadline: string;
  status: TaskStatus;
  created_at?: string;
  updated_at?: string;
}

export interface Activity {
  id: number;
  user_id: number;
  user_name: string;
  user_role: string;
  activity: string;
  created_at: string;
}

export interface SystemSetting {
  id: number;
  setting_name: string;
  setting_value: string;
}

export interface ReportSummary {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  planningProjects: number;
  onHoldProjects: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  overallProgressPercentage: number;
  totalUsers: number;
  totalTeamMembers: number;
}

export interface PieChartSlice {
  name: string;
  value: number;
  color: string;
}

export interface MemberWorkload {
  id: number;
  name: string;
  email: string;
  total_tasks: number;
  completed_tasks: number;
  in_progress_tasks: number;
  pending_tasks: number;
  completion_rate: number;
}
