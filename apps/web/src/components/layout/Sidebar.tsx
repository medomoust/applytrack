import { NavLink } from 'react-router-dom';
import { useAuthStore } from '@/lib/auth';
import { UserRole } from '@applytrack/shared';
import { LayoutDashboard, FileText, Activity, Users, Briefcase, Building2 } from 'lucide-react';

export function Sidebar() {
  const { user } = useAuthStore();

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    // Applicant-specific links
    ...(user?.role === UserRole.APPLICANT
      ? [
          { to: '/jobs', label: 'Browse Jobs', icon: Building2 },
          { to: '/applications', label: 'My Applications', icon: Briefcase },
        ]
      : []),
    // Recruiter-specific links
    ...(user?.role === UserRole.RECRUITER
      ? [
          { to: '/job-postings', label: 'Job Postings', icon: Building2 },
          { to: '/applications', label: 'Applications', icon: Briefcase },
          { to: '/admin/users', label: 'Users', icon: Users },
        ]
      : []),
    { to: '/activity', label: 'Activity', icon: Activity },
  ];

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">ApplyTrack</h1>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Job Application Tracker</p>
      </div>
      
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">
              {user?.name?.charAt(0) || user?.email.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || user?.email}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
