export type UserRole = 'superadmin' | 'mentor' | 'mentee';

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalSessions: number;
  completionRate: number;
  revenue: number;
}

export interface UserActivity {
  id: string;
  userId: string;
  activityType: string;
  description: string;
  timestamp: string;
}